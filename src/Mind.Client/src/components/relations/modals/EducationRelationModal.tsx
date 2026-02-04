import { EducationForm } from '../forms/EducationForm';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { educationSchema, type EducationFormData } from '../../../schemas/education.schema';
import type { Education } from '../../../graphql/generated/types';

interface EducationRelationModalProps {
  entity: Education;
  onSubmit: (data: EducationFormData) => Promise<void>;
}

export function EducationRelationModal({ entity, onSubmit }: EducationRelationModalProps) {
  const form = useForm<EducationFormData>({
    resolver: yupResolver(educationSchema),
    defaultValues: entity,
  });

  return (
    <form id="form-education" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <EducationForm form={form} />
    </form>
  );
}
