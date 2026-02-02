import type { UseFormReturn } from 'react-hook-form';
import { Input } from '../../ui/Input';
import { TextArea } from '../../ui/TextArea';
import type { ProjectCreateInput } from '../../../graphql/generated/types';

interface ProjectFormProps {
  form: UseFormReturn<ProjectCreateInput>;
}

export function ProjectForm({ form }: ProjectFormProps) {
  return (
    <div className="space-y-4">
      <Input label="Navn" error={form.formState.errors.name?.message} {...form.register('name')} />
      <Input
        label="Startdato"
        type="date"
        error={form.formState.errors.startDate?.message}
        {...form.register('startDate')}
      />
      <Input
        label="Slutdato"
        type="date"
        error={form.formState.errors.endDate?.message}
        {...form.register('endDate')}
      />
      <TextArea
        label="Beskrivelse"
        error={form.formState.errors.description?.message}
        {...form.register('description')}
      />
    </div>
  );
}
