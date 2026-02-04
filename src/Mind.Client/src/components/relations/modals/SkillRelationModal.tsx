import { SkillForm } from '../forms/SkillForm';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { skillSchema, type SkillFormData } from '../../../schemas/skill.schema';
import type { Skill } from '../../../graphql/generated/types';

interface SkillRelationModalProps {
  entity?: Skill;
  onSubmit: (data: SkillFormData) => Promise<void>;
}

export function SkillRelationModal({ entity, onSubmit }: SkillRelationModalProps) {
  const form = useForm<SkillFormData>({
    resolver: yupResolver(skillSchema),
    defaultValues: entity
      ? {
          name: entity.name,
          description: entity.description ?? '',
          levelOfMastery: entity.levelOfMastery,
        }
      : { levelOfMastery: 'BASIS' },
  });

  return (
    <form id="form-skill" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <SkillForm form={form} />
    </form>
  );
}
