import type { UseFormReturn } from 'react-hook-form';
import { Input } from '../../ui/Input';
import { TextArea } from '../../ui/TextArea';
import { Select } from '../../ui/Select';
import type { SkillCreateInput } from '../../../graphql/generated/types';

interface SkillFormProps {
  form: UseFormReturn<SkillCreateInput>;
}

export function SkillForm({ form }: SkillFormProps) {
  return (
    <div className="space-y-4">
      <Input label="Navn" error={form.formState.errors.name?.message} {...form.register('name')} />
      <Select
        label="Niveau"
        error={form.formState.errors.levelOfMastery?.message}
        options={[
          { value: 'BASIS', label: 'Basis' },
          { value: 'MEDIUM', label: 'Medium' },
          { value: 'STRONG', label: 'Stærk' },
          { value: 'EVANGELIST', label: 'Evangelist' },
        ]}
        {...form.register('levelOfMastery')}
      />
      <TextArea
        label="Beskrivelse"
        error={form.formState.errors.description?.message}
        {...form.register('description')}
      />
    </div>
  );
}
