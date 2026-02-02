import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useGetSkillQuery, useUpdateSkillMutation } from '../../graphql/generated/types';
import { skillSchema, type SkillFormData } from '../../schemas/skill.schema';
import { Input } from '../../components/ui/Input';
import { TextArea } from '../../components/ui/TextArea';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';

export const Route = createFileRoute('/skills/$id/edit')({
  component: EditSkillPage,
});

function EditSkillPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();

  const {
    data,
    loading: queryLoading,
    error,
  } = useGetSkillQuery({
    variables: { id },
  });

  const [updateSkill, { loading: mutationLoading }] = useUpdateSkillMutation({
    // No refetch: cache updates via mutation response + optimisticResponse
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SkillFormData>({
    resolver: yupResolver(skillSchema),
    defaultValues: {
      levelOfMastery: 'BASIS',
    },
  });

  useEffect(() => {
    if (data?.skill) {
      reset({
        name: data.skill.name,
        description: data.skill.description ?? '',
        levelOfMastery: data.skill.levelOfMastery ?? 'BASIS',
      });
    }
  }, [data, reset]);

  const onSubmit = async (formData: SkillFormData) => {
    try {
      await updateSkill({
        variables: {
          input: {
            id,
            ...formData,
          },
        },
        optimisticResponse: {
          updateSkill: {
            __typename: 'Skill',
            id,
            name: formData.name,
            description: formData.description,
            levelOfMastery: formData.levelOfMastery,
            canDelete: data?.skill?.canDelete ?? true,
          },
        },
      });
      navigate({ to: '/skills' });
    } catch (err) {
      console.error('Failed to update skill:', err);
      alert('Kunne ikke opdatere færdighed');
    }
  };

  if (queryLoading) {
    return <div className="flex justify-center items-center h-64">Indlæser...</div>;
  }

  if (error) {
    return (
      <div className="text-red-600 text-center p-4">
        Fejl ved indlæsning af færdighed: {error.message}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card title="Rediger færdighed">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Navn" {...register('name')} error={errors.name?.message} required />
          <TextArea
            label="Beskrivelse"
            {...register('description')}
            error={errors.description?.message}
            required
          />
          <Select
            label="Niveau"
            {...register('levelOfMastery')}
            error={errors.levelOfMastery?.message}
            required
            options={[
              { value: 'BASIS', label: 'Basis' },
              { value: 'MEDIUM', label: 'Medium' },
              { value: 'STRONG', label: 'Stærk' },
              { value: 'EVANGELIST', label: 'Evangelist' },
            ]}
          />

          <div className="flex gap-4 justify-end pt-4">
            <Button type="button" variant="secondary" onClick={() => navigate({ to: '/skills' })}>
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
