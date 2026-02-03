import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import {
  useGetSkillsQuery,
  useDeleteSkillMutation,
  useCreateSkillMutation,
  useUpdateSkillMutation,
  type Skill,
  type SkillCreateInput,
  type SkillUpsertInput,
} from '../../graphql/generated/types';
import { Table } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { RelationModal } from '../../components/relations/RelationModal';

export const Route = createFileRoute('/skills/')({
  component: SkillListPage,
});

function SkillListPage() {
  const { data, loading, error } = useGetSkillsQuery();
  const [deleteSkill] = useDeleteSkillMutation();
  const [createSkill] = useCreateSkillMutation();
  const [updateSkill] = useUpdateSkillMutation();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);

  const handleCreate = () => {
    setEditingSkill(null);
    setIsModalOpen(true);
  };

  const handleEdit = (skill: Skill) => {
    setEditingSkill(skill);
    setIsModalOpen(true);
  };

  const handleSubmit = async (formData: unknown) => {
    try {
      if (editingSkill) {
        await updateSkill({
          variables: {
            input: { ...(formData as SkillCreateInput), id: editingSkill.id } as SkillUpsertInput,
          },
          refetchQueries: ['GetSkills'],
        });
      } else {
        await createSkill({
          variables: { input: formData as SkillCreateInput },
          refetchQueries: ['GetSkills'],
        });
      }
      setIsModalOpen(false);
      setEditingSkill(null);
    } catch (err) {
      console.error('Failed to save skill:', err);
      alert('Kunne ikke gemme færdighed');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Er du sikker på, at du vil slette denne færdighed?')) {
      setDeletingId(id);
      try {
        await deleteSkill({
          variables: { id },
          optimisticResponse: {
            deleteSkill: true,
          },
          update: (cache) => {
            cache.modify({
              fields: {
                skills(existingRefs, { readField }) {
                  if (!Array.isArray(existingRefs)) {
                    return existingRefs;
                  }

                  return existingRefs.filter((ref) => readField('id', ref) !== id);
                },
              },
            });

            const cacheId = cache.identify({ __typename: 'Skill', id });
            if (cacheId) {
              cache.evict({ id: cacheId });
              cache.gc();
            }
          },
        });
      } catch (err) {
        console.error('Failed to delete skill:', err);
        alert('Kunne ikke slette færdighed');
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
        Fejl ved indlæsning af færdigheder: {error.message}
      </div>
    );
  }

  const skills = data?.skills || [];

  const getLevelLabel = (level: string) => {
    const labels: Record<string, string> = {
      BASIS: 'Basis',
      MEDIUM: 'Medium',
      STRONG: 'Stærk',
      EVANGELIST: 'Evangelist',
    };
    return labels[level] || level;
  };

  const columns = [
    {
      header: 'Navn',
      accessor: 'name' as keyof Skill,
    },
    {
      header: 'Niveau',
      accessor: (skill: Skill) => getLevelLabel(skill.levelOfMastery),
      className: 'whitespace-nowrap',
    },
    {
      header: 'Beskrivelse',
      accessor: (skill: Skill) => (
        <span className="block max-w-md truncate" title={skill.description ?? ''}>
          {skill.description ?? ''}
        </span>
      ),
      className: 'max-w-md',
    },
    {
      header: 'Handlinger',
      accessor: (skill: Skill) => (
        <div className="flex gap-2 justify-end">
          <Button
            size="sm"
            variant="secondary"
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(skill);
            }}
          >
            Rediger
          </Button>
          <span
            className="inline-block"
            title={
              skill.canDelete === false
                ? "Kan ikke slettes, fordi den bruges i et eller flere CV'er."
                : undefined
            }
          >
            <Button
              size="sm"
              variant="danger"
              title={
                skill.canDelete === false
                  ? "Kan ikke slettes, fordi den bruges i et eller flere CV'er."
                  : undefined
              }
              disabled={skill.canDelete === false || deletingId === skill.id}
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(skill.id);
              }}
            >
              Slet
            </Button>
          </span>
        </div>
      ),
      className: 'w-px whitespace-nowrap text-right',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <Card
        title="Færdigheder"
        actions={<Button onClick={handleCreate}>Opret ny færdighed</Button>}
      >
        <Table data={skills as Skill[]} columns={columns} emptyMessage="Ingen færdigheder fundet" />
      </Card>

      <RelationModal
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingSkill(null);
        }}
        type="skill"
        mode={editingSkill ? 'edit' : 'create'}
        entity={editingSkill || undefined}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
