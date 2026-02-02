import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useCreateEducationMutation } from '../../graphql/generated/types';
import { educationSchema, type EducationFormData } from '../../schemas/education.schema';
import { Input } from '../../components/ui/Input';
import { TextArea } from '../../components/ui/TextArea';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';

export const Route = createFileRoute('/education/create')({
  component: CreateEducationPage,
});

function CreateEducationPage() {
  const navigate = useNavigate();
  const [createEducation, { loading }] = useCreateEducationMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EducationFormData>({
    resolver: yupResolver(educationSchema),
  });

  const onSubmit = async (data: EducationFormData) => {
    try {
      const tempId = `temp:education:${data.name}:${data.zipCode ?? ''}:${data.city ?? ''}`;

      await createEducation({
        variables: { input: data },
        optimisticResponse: {
          createEducation: {
            __typename: 'Education',
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
          const created = result?.createEducation;
          if (!created) return;

          cache.modify({
            fields: {
              educations(existingRefs, { readField, toReference }) {
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
            const tempCacheId = cache.identify({ __typename: 'Education', id: tempId });
            if (tempCacheId) {
              cache.evict({ id: tempCacheId });
              cache.gc();
            }
          }
        },
      });
      navigate({ to: '/education' });
    } catch (err) {
      console.error('Failed to create education:', err);
      alert('Kunne ikke oprette uddannelse');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card title="Opret ny uddannelse">
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
            <Button type="submit" disabled={loading}>
              Opret uddannelse
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
