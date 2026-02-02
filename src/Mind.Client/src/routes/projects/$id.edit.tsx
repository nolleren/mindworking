import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useGetProjectQuery, useUpdateProjectMutation } from '../../graphql/generated/types';
import { projectSchema, type ProjectFormData } from '../../schemas/project.schema';
import { Input } from '../../components/ui/Input';
import { TextArea } from '../../components/ui/TextArea';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';

export const Route = createFileRoute('/projects/$id/edit')({
  component: EditProjectPage,
});

function EditProjectPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();

  const {
    data,
    loading: queryLoading,
    error,
  } = useGetProjectQuery({
    variables: { id },
  });

  const [updateProject, { loading: mutationLoading }] = useUpdateProjectMutation({
    // No refetch: cache updates via mutation response + optimisticResponse
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProjectFormData>({
    resolver: yupResolver(projectSchema),
  });

  useEffect(() => {
    if (data?.project) {
      reset({
        name: data.project.name,
        startDate: data.project.startDate ?? '',
        endDate: data.project.endDate ?? '',
        description: data.project.description ?? '',
      });
    }
  }, [data, reset]);

  const onSubmit = async (formData: ProjectFormData) => {
    try {
      await updateProject({
        variables: {
          input: {
            id,
            ...formData,
          },
        },
        optimisticResponse: {
          updateProject: {
            __typename: 'Project',
            id,
            name: formData.name,
            startDate: formData.startDate,
            endDate: formData.endDate,
            description: formData.description,
            canDelete: data?.project?.canDelete ?? true,
          },
        },
      });
      navigate({ to: '/projects' });
    } catch (err) {
      console.error('Failed to update project:', err);
      alert('Kunne ikke opdatere projekt');
    }
  };

  if (queryLoading) {
    return <div className="flex justify-center items-center h-64">Indlæser...</div>;
  }

  if (error) {
    return (
      <div className="text-red-600 text-center p-4">
        Fejl ved indlæsning af projekt: {error.message}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card title="Rediger projekt">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Navn" {...register('name')} error={errors.name?.message} required />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Startdato"
              type="date"
              {...register('startDate')}
              error={errors.startDate?.message}
              required
            />
            <Input
              label="Slutdato"
              type="date"
              {...register('endDate')}
              error={errors.endDate?.message}
              required
            />
          </div>

          <TextArea
            label="Beskrivelse"
            {...register('description')}
            error={errors.description?.message}
            required
          />

          <div className="flex gap-4 justify-end pt-4">
            <Button type="button" variant="secondary" onClick={() => navigate({ to: '/projects' })}>
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
