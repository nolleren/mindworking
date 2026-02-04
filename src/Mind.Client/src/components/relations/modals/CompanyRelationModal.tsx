import { CompanyForm } from '../forms/CompanyForm';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { CompanyFormData, companySchema } from '../../../schemas/company.schema';
import type { Company } from '../../../graphql/generated/types';
import { FormRelationType } from '@/hooks/relations/types';

interface CompanyRelationModalProps {
  entity: Company;
  onSubmit: (data: FormRelationType) => Promise<void>;
}

export function CompanyRelationModal({ entity, onSubmit }: CompanyRelationModalProps) {
  const form = useForm<CompanyFormData>({
    resolver: yupResolver(companySchema),
    defaultValues: entity,
  });

  return (
    <form
      id="form-company"
      onSubmit={form.handleSubmit((data: FormRelationType) => onSubmit(data))}
      className="space-y-4"
    >
      <CompanyForm form={form} />
    </form>
  );
}
