import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import {
  useGetEducationsQuery,
  useDeleteEducationMutation,
  useCreateEducationMutation,
  useUpdateEducationMutation,
  type Education,
  type EducationCreateInput,
  type EducationUpsertInput,
} from '../../graphql/generated/types';
import { Table } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { RelationModal } from '../../components/relations/RelationModal';

export const Route = createFileRoute('/education/')({
  component: EducationListPage,
});

function EducationListPage() {
  const { data, loading, error } = useGetEducationsQuery();
  const [deleteEducation] = useDeleteEducationMutation();
  const [createEducation] = useCreateEducationMutation();
  const [updateEducation] = useUpdateEducationMutation();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEducation, setEditingEducation] = useState<Education | null>(null);

  const handleCreate = () => {
    setEditingEducation(null);
    setIsModalOpen(true);
  };

  const handleEdit = (education: Education) => {
    setEditingEducation(education);
    setIsModalOpen(true);
  };

  const handleSubmit = async (formData: unknown) => {
    try {
      if (editingEducation) {
        await updateEducation({
          variables: { input: formData as EducationUpsertInput },
          refetchQueries: ['GetEducations'],
        });
      } else {
        await createEducation({
          variables: { input: formData as EducationCreateInput },
          refetchQueries: ['GetEducations'],
        });
      }
      setIsModalOpen(false);
      setEditingEducation(null);
    } catch (err) {
      console.error('Failed to save education:', err);
      alert('Kunne ikke gemme uddannelse');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Er du sikker på, at du vil slette denne uddannelse?')) {
      setDeletingId(id);
      try {
        await deleteEducation({
          variables: { id },
          optimisticResponse: {
            deleteEducation: true,
          },
          update: (cache) => {
            cache.modify({
              fields: {
                educations(existingRefs, { readField }) {
                  if (!Array.isArray(existingRefs)) {
                    return existingRefs;
                  }

                  return existingRefs.filter((ref) => readField('id', ref) !== id);
                },
              },
            });

            const cacheId = cache.identify({ __typename: 'Education', id });
            if (cacheId) {
              cache.evict({ id: cacheId });
              cache.gc();
            }
          },
        });
      } catch (err) {
        console.error('Failed to delete education:', err);
        alert('Kunne ikke slette uddannelse');
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
        Fejl ved indlæsning af uddannelser: {error.message}
      </div>
    );
  }

  const educations = data?.educations || [];

  const columns = [
    {
      header: 'Navn',
      accessor: 'name' as keyof Education,
    },
    {
      header: 'Adresse',
      accessor: (education: Education) => education.address ?? '',
      className: 'whitespace-nowrap',
    },
    {
      header: 'Postnr',
      accessor: (education: Education) => education.zipCode ?? '',
      className: 'whitespace-nowrap',
    },
    {
      header: 'By',
      accessor: 'city' as keyof Education,
      className: 'whitespace-nowrap',
    },
    {
      header: 'Beskrivelse',
      accessor: (education: Education) => (
        <span className="block max-w-md truncate" title={education.description ?? ''}>
          {education.description ?? ''}
        </span>
      ),
      className: 'max-w-md',
    },
    {
      header: 'Handlinger',
      accessor: (education: Education) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(education);
            }}
          >
            Rediger
          </Button>
          <span
            className="inline-block"
            title={
              education.canDelete === false
                ? "Kan ikke slettes, fordi den bruges i et eller flere CV'er."
                : undefined
            }
          >
            <Button
              size="sm"
              variant="danger"
              title={
                education.canDelete === false
                  ? "Kan ikke slettes, fordi den bruges i et eller flere CV'er."
                  : undefined
              }
              disabled={education.canDelete === false || deletingId === education.id}
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(education.id);
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
      <Card
        title="Uddannelser"
        actions={<Button onClick={handleCreate}>Opret ny uddannelse</Button>}
      >
        <Table
          data={educations as Education[]}
          columns={columns}
          emptyMessage="Ingen uddannelser fundet"
        />
      </Card>

      <RelationModal
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingEducation(null);
        }}
        type="education"
        mode={editingEducation ? 'edit' : 'create'}
        entity={editingEducation || undefined}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
