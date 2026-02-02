import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useGetCompanyQuery, useUpdateCompanyMutation } from '../../graphql/generated/types';
import { companySchema, type CompanyFormData } from '../../schemas/company.schema';
import { Input } from '../../components/ui/Input';
import { TextArea } from '../../components/ui/TextArea';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';

export const Route = createFileRoute('/companies/$id/edit')({
  component: EditCompanyPage,
});

function EditCompanyPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();

  const {
    data,
    loading: queryLoading,
    error,
  } = useGetCompanyQuery({
    variables: { id },
  });

  const [updateCompany, { loading: mutationLoading }] = useUpdateCompanyMutation({
    // No refetch: cache updates via mutation response + optimisticResponse
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CompanyFormData>({
    resolver: yupResolver(companySchema),
  });

  useEffect(() => {
    if (data?.company) {
      reset({
        name: data.company.name,
        address: data.company.address ?? '',
        zipCode: data.company.zipCode ?? '',
        city: data.company.city ?? '',
        description: data.company.description ?? '',
      });
    }
  }, [data, reset]);

  const onSubmit = async (formData: CompanyFormData) => {
    try {
      await updateCompany({
        variables: {
          input: {
            id,
            ...formData,
          },
        },
        optimisticResponse: {
          updateCompany: {
            __typename: 'Company',
            id,
            name: formData.name,
            address: formData.address,
            zipCode: formData.zipCode,
            city: formData.city,
            description: formData.description,
            canDelete: data?.company?.canDelete ?? true,
          },
        },
      });
      navigate({ to: '/companies' });
    } catch (err) {
      console.error('Failed to update company:', err);
      alert('Kunne ikke opdatere virksomhed');
    }
  };

  if (queryLoading) {
    return <div className="flex justify-center items-center h-64">Indlæser...</div>;
  }

  if (error) {
    return (
      <div className="text-red-600 text-center p-4">
        Fejl ved indlæsning af virksomhed: {error.message}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card title="Rediger virksomhed">
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
            <Button type="submit" disabled={mutationLoading}>
              Gem ændringer
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
