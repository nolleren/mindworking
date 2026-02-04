import { Card } from '@/components/ui/Card';
import { RelationList } from '@/components/relations/RelationList';
import { Skill, SkillCreateInput, SkillUpsertInput } from '@/graphql/generated/types';
import { useRelationCrud } from '@/hooks/relations/useRelationCrud';
import type { RelationEntity, SkillListItemEntity } from '@/hooks/relations/types';
import { Dispatch, SetStateAction } from 'react';

interface SkillRelationSectionProps {
  allSkills: SkillListItemEntity[];
  selected: SkillListItemEntity[];
  onChange: Dispatch<SetStateAction<SkillListItemEntity[]>>;
}

export function SkillRelationSection({ allSkills, selected, onChange }: SkillRelationSectionProps) {
  const { createEntity, updateEntity, getAvailableEntities } = useRelationCrud();

  const availableSkills = getAvailableEntities(
    allSkills,
    selected.map((s) => s.id)
  );

  const handleAddSkills = async (skillIds: string[]) => {
    const skills = allSkills.filter((s) => skillIds.includes(s.id));
    onChange((prev) => [...prev, ...skills]);
  };

  const handleCreateSkill = async (data: unknown) => {
    const created = await createEntity('skill', data as SkillCreateInput);
    if (created) {
      onChange((prev) => [...prev, created as Skill]);
    }
  };

  const handleEditSkill = async (entity: RelationEntity, data: RelationEntity) => {
    const updated = await updateEntity('skill', data as SkillUpsertInput);
    if (updated) {
      onChange((prev) => prev.map((s) => (s.id === entity.id ? (updated as Skill) : s)));
    }
  };

  const handleDeleteSkill = async (skillId: string) => {
    onChange((prev) => prev.filter((s) => s.id !== skillId));
  };

  return (
    <Card>
      <RelationList
        type="skill"
        entities={selected}
        availableEntities={availableSkills}
        onAdd={handleAddSkills}
        onCreate={handleCreateSkill}
        onEdit={handleEditSkill}
        onDelete={handleDeleteSkill}
      />
    </Card>
  );
}
