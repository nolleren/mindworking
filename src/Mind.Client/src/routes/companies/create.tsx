import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useCreateCompanyMutation } from '../../graphql/generated/types';
import { companySchema, type CompanyFormData } from '../../schemas/company.schema';
import { Input } from '../../components/ui/Input';
import { TextArea } from '../../components/ui/TextArea';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';

export const Route = createFileRoute('/companies/create')({
  component: CreateCompanyPage,
});

function CreateCompanyPage() {
  const navigate = useNavigate();
  const [createCompany, { loading }] = useCreateCompanyMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CompanyFormData>({
    resolver: yupResolver(companySchema),
  });

  const onSubmit = async (data: CompanyFormData) => {
    try {
      const tempId = `temp:company:${data.name}:${data.zipCode ?? ''}:${data.city ?? ''}`;

      await createCompany({
        variables: { input: data },
        optimisticResponse: {
          createCompany: {
            __typename: 'Company',
            id: tempId,
            name: data.name,
            address: data.address,
            zipCode: data.zipCode,
            city: data.city,
            description: data.description,
            canDelete: true,
          },
        },
        update: (cache, { data: result }) => {
          const created = result?.createCompany;
          if (!created) return;

          cache.modify({
            fields: {
              companies(existingRefs, { readField, toReference }) {
                if (!Array.isArray(existingRefs)) {
                  return existingRefs;
                }

                const nextRef = toReference(created) ?? created;
                return [
                  ...existingRefs.filter((ref) => {
                    const existingId = readField('id', ref);
                    return existingId !== tempId && existingId !== created.id;
                  }),
                  nextRef,
                ];
              },
            },
          });

          if (created.id !== tempId) {
            const tempCacheId = cache.identify({ __typename: 'Company', id: tempId });
            if (tempCacheId) {
              cache.evict({ id: tempCacheId });
              cache.gc();
            }
          }
        },
      });
      navigate({ to: '/companies' });
    } catch (err) {
      console.error('Failed to create company:', err);
      alert('Kunne ikke oprette virksomhed');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card title="Opret ny virksomhed">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Navn" {...register('name')} error={errors.name?.message} required />
          <Input
            label="Adresse"
            {...register('address')}
            error={errors.address?.message}
            required
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Postnummer"
              {...register('zipCode')}
              error={errors.zipCode?.message}
              required
            />
            <Input label="By" {...register('city')} error={errors.city?.message} required />
          </div>
          <TextArea
            label="Beskrivelse"
            {...register('description')}
            error={errors.description?.message}
            required
          />

          <div className="flex gap-4 justify-end pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate({ to: '/companies' })}
            >
              Annuller
            </Button>
            <Button type="submit" disabled={loading}>
              Opret virksomhed
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
