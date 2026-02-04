import { CompanyForm } from '../forms/CompanyForm';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { companySchema, type CompanyFormData } from '../../../schemas/company.schema';
import type { Company } from '../../../graphql/generated/types';

interface CompanyRelationModalProps {
  entity?: Company;
  onSubmit: (data: CompanyFormData) => Promise<void>;
}

export function CompanyRelationModal({ entity, onSubmit }: CompanyRelationModalProps) {
  const form = useForm<CompanyFormData>({
    resolver: yupResolver(companySchema),
    defaultValues: entity
      ? {
          name: entity.name,
          address: entity.address ?? '',
          zipCode: entity.zipCode ?? '',
          city: entity.city ?? '',
          description: entity.description ?? '',
        }
      : undefined,
  });

  return (
    <form id="form-company" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <CompanyForm form={form} />
    </form>
  );
}
