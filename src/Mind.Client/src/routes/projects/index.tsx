import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import {
  useGetProjectsQuery,
  useDeleteProjectMutation,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  type Project,
  type ProjectCreateInput,
  type ProjectUpsertInput,
} from '../../graphql/generated/types';
import { Table } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { RelationModal } from '../../components/relations/RelationModal';

export const Route = createFileRoute('/projects/')({
  component: ProjectListPage,
});

function ProjectListPage() {
  const { data, loading, error } = useGetProjectsQuery();
  const [deleteProject] = useDeleteProjectMutation();
  const [createProject] = useCreateProjectMutation();
  const [updateProject] = useUpdateProjectMutation();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const handleCreate = () => {
    setEditingProject(null);
    setIsModalOpen(true);
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setIsModalOpen(true);
  };

  const handleSubmit = async (formData: unknown) => {
    try {
      if (editingProject) {
        await updateProject({
          variables: {
            input: {
              ...(formData as ProjectCreateInput),
              id: editingProject.id,
            } as ProjectUpsertInput,
          },
          refetchQueries: ['GetProjects'],
        });
      } else {
        await createProject({
          variables: { input: formData as ProjectCreateInput },
          refetchQueries: ['GetProjects'],
        });
      }
      setIsModalOpen(false);
      setEditingProject(null);
    } catch (err) {
      console.error('Failed to save project:', err);
      alert('Kunne ikke gemme projekt');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Er du sikker på, at du vil slette dette projekt?')) {
      setDeletingId(id);
      try {
        await deleteProject({
          variables: { id },
          optimisticResponse: {
            deleteProject: true,
          },
          update: (cache) => {
            cache.modify({
              fields: {
                projects(existingRefs, { readField }) {
                  if (!Array.isArray(existingRefs)) {
                    return existingRefs;
                  }

                  return existingRefs.filter((ref) => readField('id', ref) !== id);
                },
              },
            });

            const cacheId = cache.identify({ __typename: 'Project', id });
            if (cacheId) {
              cache.evict({ id: cacheId });
              cache.gc();
            }
          },
        });
      } catch (err) {
        console.error('Failed to delete project:', err);
        alert('Kunne ikke slette projekt');
      } finally {
        setDeletingId(null);
      }
    }
  };

  if (loading && !data) {
    return <div className="flex justify-center items-center h-64">Indlæser...</div>;
  }

  if (error) {
    return (
      <div className="text-red-600 text-center p-4">
        Fejl ved indlæsning af projekter: {error.message}
      </div>
    );
  }

  const projects = data?.projects || [];

  const columns = [
    {
      header: 'Navn',
      accessor: 'name' as keyof Project,
    },
    {
      header: 'Start',
      accessor: (project: Project) => project.startDate ?? '',
      className: 'whitespace-nowrap',
    },
    {
      header: 'Slut',
      accessor: (project: Project) => project.endDate ?? '',
      className: 'whitespace-nowrap',
    },
    {
      header: 'Beskrivelse',
      accessor: (project: Project) => (
        <span className="block max-w-md truncate" title={project.description ?? ''}>
          {project.description ?? ''}
        </span>
      ),
      className: 'max-w-md',
    },
    {
      header: 'Handlinger',
      accessor: (project: Project) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(project);
            }}
          >
            Rediger
          </Button>
          <span
            className="inline-block"
            title={
              project.canDelete === false
                ? "Kan ikke slettes, fordi den bruges i et eller flere CV'er."
                : undefined
            }
          >
            <Button
              size="sm"
              variant="danger"
              title={
                project.canDelete === false
                  ? "Kan ikke slettes, fordi den bruges i et eller flere CV'er."
                  : undefined
              }
              disabled={project.canDelete === false || deletingId === project.id}
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(project.id);
              }}
            >
              Slet
            </Button>
          </span>
        </div>
      ),
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <Card title="Projekter" actions={<Button onClick={handleCreate}>Opret nyt projekt</Button>}>
        <Table
          data={projects as Project[]}
          columns={columns}
          emptyMessage="Ingen projekter fundet"
        />
      </Card>

      <RelationModal
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingProject(null);
        }}
        type="project"
        mode={editingProject ? 'edit' : 'create'}
        entity={editingProject || undefined}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
