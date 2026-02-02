import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useCreateProjectMutation } from '../../graphql/generated/types';
import { projectSchema, type ProjectFormData } from '../../schemas/project.schema';
import { Input } from '../../components/ui/Input';
import { TextArea } from '../../components/ui/TextArea';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';

export const Route = createFileRoute('/projects/create')({
  component: CreateProjectPage,
});

function CreateProjectPage() {
  const navigate = useNavigate();
  const [createProject, { loading }] = useCreateProjectMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProjectFormData>({
    resolver: yupResolver(projectSchema),
  });

  const onSubmit = async (data: ProjectFormData) => {
    try {
      const tempId = `temp:project:${data.name}:${data.startDate ?? ''}:${data.endDate ?? ''}`;

      await createProject({
        variables: { input: data },
        optimisticResponse: {
          createProject: {
            __typename: 'Project',
            id: tempId,
            name: data.name,
            startDate: data.startDate,
            endDate: data.endDate,
            description: data.description,
            canDelete: true,
          },
        },
        update: (cache, { data: result }) => {
          const created = result?.createProject;
          if (!created) return;

          cache.modify({
            fields: {
              projects(existingRefs, { readField, toReference }) {
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
            const tempCacheId = cache.identify({ __typename: 'Project', id: tempId });
            if (tempCacheId) {
              cache.evict({ id: tempCacheId });
              cache.gc();
            }
          }
        },
      });
      navigate({ to: '/projects' });
    } catch (err) {
      console.error('Failed to create project:', err);
      alert('Kunne ikke oprette projekt');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card title="Opret nyt projekt">
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
            <Button type="submit" disabled={loading}>
              Opret projekt
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
