import { Card } from '@/components/ui/Card';
import { RelationList } from '@/components/relations/RelationList';
import { Education, EducationCreateInput, EducationUpsertInput } from '@/graphql/generated/types';
import { useRelationCrud } from '@/hooks/relations/useRelationCrud';
import type { EducationListItemEntity, RelationEntity } from '@/hooks/relations/types';
import { useEffect, useState } from 'react';

interface EducationRelationSectionProps {
  allEducations: EducationListItemEntity[];
  selected: EducationListItemEntity[];
  onChange: (educations: EducationListItemEntity[]) => void;
}

export function EducationRelationSection({
  allEducations,
  selected,
  onChange,
}: EducationRelationSectionProps) {
  const [selectedEducations, setSelectedEducations] = useState<EducationListItemEntity[]>(selected);
  const { createEntity, updateEntity, getAvailableEntities } = useRelationCrud();

  useEffect(() => {
    onChange(selectedEducations);
  }, [selectedEducations, onChange]);

  const availableEducations = getAvailableEntities(
    allEducations,
    selectedEducations.map((e) => e.id)
  );

  const handleAddEducations = async (educationIds: string[]) => {
    const educations = allEducations.filter((e) => educationIds.includes(e.id));
    setSelectedEducations((prev) => [...prev, ...educations]);
  };

  const handleCreateEducation = async (data: unknown) => {
    const created = await createEntity('education', data as EducationCreateInput);
    if (created) {
      setSelectedEducations((prev) => [...prev, created as Education]);
    }
  };

  const handleEditEducation = async (_entity: RelationEntity, data: unknown) => {
    const updated = await updateEntity('education', data as EducationUpsertInput);
    if (updated) {
      setSelectedEducations((prev) =>
        prev.map((e) =>
          'id' in e && 'id' in _entity && e.id === _entity.id ? (updated as Education) : e
        )
      );
    }
  };

  const handleDeleteEducation = async (educationId: string) => {
    setSelectedEducations((prev) => prev.filter((e) => 'id' in e && e.id !== educationId));
  };

  return (
    <Card>
      <RelationList
        type="education"
        entities={selectedEducations}
        availableEntities={availableEducations}
        onAdd={handleAddEducations}
        onCreate={handleCreateEducation}
        onEdit={handleEditEducation}
        onDelete={handleDeleteEducation}
      />
    </Card>
  );
}
