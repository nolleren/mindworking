import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useCreateSkillMutation } from '../../graphql/generated/types';
import { skillSchema, type SkillFormData } from '../../schemas/skill.schema';
import { Input } from '../../components/ui/Input';
import { TextArea } from '../../components/ui/TextArea';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';

export const Route = createFileRoute('/skills/create')({
  component: CreateSkillPage,
});

function CreateSkillPage() {
  const navigate = useNavigate();
  const [createSkill, { loading }] = useCreateSkillMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SkillFormData>({
    resolver: yupResolver(skillSchema),
    defaultValues: {
      levelOfMastery: 'BASIS',
    },
  });

  const onSubmit = async (data: SkillFormData) => {
    try {
      const tempId = `temp:skill:${data.name}:${data.levelOfMastery}`;

      await createSkill({
        variables: { input: data },
        optimisticResponse: {
          createSkill: {
            __typename: 'Skill',
            id: tempId,
            name: data.name,
            description: data.description,
            levelOfMastery: data.levelOfMastery,
            canDelete: true,
          },
        },
        update: (cache, { data: result }) => {
          const created = result?.createSkill;
          if (!created) return;

          cache.modify({
            fields: {
              skills(existingRefs, { readField, toReference }) {
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
            const tempCacheId = cache.identify({ __typename: 'Skill', id: tempId });
            if (tempCacheId) {
              cache.evict({ id: tempCacheId });
              cache.gc();
            }
          }
        },
      });
      navigate({ to: '/skills' });
    } catch (err) {
      console.error('Failed to create skill:', err);
      alert('Kunne ikke oprette færdighed');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card title="Opret ny færdighed">
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
            <Button type="submit" disabled={loading}>
              Opret færdighed
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
