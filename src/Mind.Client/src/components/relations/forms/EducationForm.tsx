import type { UseFormReturn } from 'react-hook-form';
import { Input } from '../../ui/Input';
import { TextArea } from '../../ui/TextArea';
import type { EducationCreateInput } from '../../../graphql/generated/types';

interface EducationFormProps {
  form: UseFormReturn<EducationCreateInput>;
}

export function EducationForm({ form }: EducationFormProps) {
  return (
    <div className="space-y-4">
      <Input label="Navn" error={form.formState.errors.name?.message} {...form.register('name')} />
      <Input
        label="Adresse"
        error={form.formState.errors.address?.message}
        {...form.register('address')}
      />
      <Input
        label="Postnr."
        error={form.formState.errors.zipCode?.message}
        {...form.register('zipCode')}
      />
      <Input label="By" error={form.formState.errors.city?.message} {...form.register('city')} />
      <TextArea
        label="Beskrivelse"
        error={form.formState.errors.description?.message}
        {...form.register('description')}
      />
    </div>
  );
}
