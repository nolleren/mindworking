import { ProjectForm } from '../forms/ProjectForm';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { projectSchema, type ProjectFormData } from '../../../schemas/project.schema';
import type { Project } from '../../../graphql/generated/types';

function normalizeDateInput(value?: string | null) {
  if (!value) return '';
  return value.length >= 10 ? value.slice(0, 10) : value;
}

interface ProjectRelationModalProps {
  entity: Project;
  onSubmit: (data: ProjectFormData) => Promise<void>;
}

export function ProjectRelationModal({ entity, onSubmit }: ProjectRelationModalProps) {
  const form = useForm<ProjectFormData>({
    resolver: yupResolver(projectSchema),
    defaultValues: {
      name: entity.name,
      startDate: normalizeDateInput(entity.startDate),
      endDate: normalizeDateInput(entity.endDate),
      description: entity.description,
    },
  });

  return (
    <form id="form-project" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <ProjectForm form={form} />
    </form>
  );
}
