import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useGetEducationQuery, useUpdateEducationMutation } from '../../graphql/generated/types';
import { educationSchema, type EducationFormData } from '../../schemas/education.schema';
import { Input } from '../../components/ui/Input';
import { TextArea } from '../../components/ui/TextArea';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';

export const Route = createFileRoute('/education/$id/edit')({
  component: EditEducationPage,
});

function EditEducationPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();

  const {
    data,
    loading: queryLoading,
    error,
  } = useGetEducationQuery({
    variables: { id },
  });

  const [updateEducation, { loading: mutationLoading }] = useUpdateEducationMutation({
    // No refetch: cache updates via mutation response + optimisticResponse
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EducationFormData>({
    resolver: yupResolver(educationSchema),
  });

  useEffect(() => {
    if (data?.education) {
      reset({
        name: data.education.name,
        address: data.education.address ?? '',
        zipCode: data.education.zipCode ?? '',
        city: data.education.city ?? '',
        description: data.education.description ?? '',
      });
    }
  }, [data, reset]);

  const onSubmit = async (formData: EducationFormData) => {
    try {
      await updateEducation({
        variables: {
          input: {
            id,
            ...formData,
          },
        },
        optimisticResponse: {
          updateEducation: {
            __typename: 'Education',
            id,
            name: formData.name,
            address: formData.address,
            zipCode: formData.zipCode,
            city: formData.city,
            description: formData.description,
            canDelete: data?.education?.canDelete ?? true,
          },
        },
      });
      navigate({ to: '/education' });
    } catch (err) {
      console.error('Failed to update education:', err);
      alert('Kunne ikke opdatere uddannelse');
    }
  };

  if (queryLoading) {
    return <div className="flex justify-center items-center h-64">Indlæser...</div>;
  }

  if (error) {
    return (
      <div className="text-red-600 text-center p-4">
        Fejl ved indlæsning af uddannelse: {error.message}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card title="Rediger uddannelse">
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
              onClick={() => navigate({ to: '/education' })}
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
