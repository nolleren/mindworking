import { useCallback } from 'react';
import type { Reference } from '@apollo/client';
import {
  useCreateCompanyMutation,
  useCreateEducationMutation,
  useCreateProjectMutation,
  useCreateSkillMutation,
} from '../../graphql/generated/types';
import type { CreateInputMap, RelationType, RelationEntity } from './types';

export function useCreateEntity(onError?: (error: Error) => void) {
  const [createCompanyMutation] = useCreateCompanyMutation();
  const [createEducationMutation] = useCreateEducationMutation();
  const [createProjectMutation] = useCreateProjectMutation();
  const [createSkillMutation] = useCreateSkillMutation();

  const createEntity = useCallback(
    async <T extends RelationType>(
      type: T,
      input: CreateInputMap[T]
    ): Promise<RelationEntity | null> => {
      try {
        const tempId = `temp:${type}:${Date.now()}`;

        switch (type) {
          case 'company': {
            const companyInput = input as CreateInputMap['company'];
            const result = await createCompanyMutation({
              variables: { input: companyInput },
              optimisticResponse: {
                createCompany: {
                  __typename: 'Company',
                  id: tempId,
                  name: companyInput.name,
                  address: companyInput.address,
                  zipCode: companyInput.zipCode,
                  city: companyInput.city,
                  description: companyInput.description,
                  canDelete: true,
                },
              },
              update: (cache, { data: mutationResult }) => {
                const created = mutationResult?.createCompany;
                if (!created) return;

                cache.modify({
                  fields: {
                    companies(existingRefs = [], { readField, toReference }) {
                      const nextRef = toReference(created) ?? created;
                      return [
                        ...existingRefs.filter((ref: Reference) => {
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
            return (result.data?.createCompany ?? null) as RelationEntity | null;
          }

          case 'education': {
            const educationInput = input as CreateInputMap['education'];
            const result = await createEducationMutation({
              variables: { input: educationInput },
              optimisticResponse: {
                createEducation: {
                  __typename: 'Education',
                  id: tempId,
                  name: educationInput.name,
                  address: educationInput.address,
                  zipCode: educationInput.zipCode,
                  city: educationInput.city,
                  description: educationInput.description,
                  canDelete: true,
                },
              },
              update: (cache, { data: mutationResult }) => {
                const created = mutationResult?.createEducation;
                if (!created) return;

                cache.modify({
                  fields: {
                    educations(existingRefs = [], { readField, toReference }) {
                      const nextRef = toReference(created) ?? created;
                      return [
                        ...existingRefs.filter((ref: Reference) => {
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
            return (result.data?.createEducation ?? null) as RelationEntity | null;
          }

          case 'project': {
            const projectInput = input as CreateInputMap['project'];
            const result = await createProjectMutation({
              variables: { input: projectInput },
              optimisticResponse: {
                createProject: {
                  __typename: 'Project',
                  id: tempId,
                  name: projectInput.name,
                  startDate: projectInput.startDate,
                  endDate: projectInput.endDate,
                  description: projectInput.description,
                  canDelete: true,
                },
              },
              update: (cache, { data: mutationResult }) => {
                const created = mutationResult?.createProject;
                if (!created) return;

                cache.modify({
                  fields: {
                    projects(existingRefs = [], { readField, toReference }) {
                      const nextRef = toReference(created) ?? created;
                      return [
                        ...existingRefs.filter((ref: Reference) => {
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
            return (result.data?.createProject ?? null) as RelationEntity | null;
          }

          case 'skill': {
            const skillInput = input as CreateInputMap['skill'];
            const result = await createSkillMutation({
              variables: { input: skillInput },
              optimisticResponse: {
                createSkill: {
                  __typename: 'Skill',
                  id: tempId,
                  name: skillInput.name,
                  description: skillInput.description,
                  levelOfMastery: skillInput.levelOfMastery,
                  canDelete: true,
                },
              },
              update: (cache, { data: mutationResult }) => {
                const created = mutationResult?.createSkill;
                if (!created) return;

                cache.modify({
                  fields: {
                    skills(existingRefs = [], { readField, toReference }) {
                      const nextRef = toReference(created) ?? created;
                      return [
                        ...existingRefs.filter((ref: Reference) => {
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
            return (result.data?.createSkill ?? null) as RelationEntity | null;
          }

          default:
            throw new Error(`Unknown relation type: ${type}`);
        }
      } catch (error) {
        console.error(`Failed to create ${type}:`, error);
        onError?.(error as Error);
        return null;
      }
    },
    [
      createCompanyMutation,
      createEducationMutation,
      createProjectMutation,
      createSkillMutation,
      onError,
    ]
  );

  return createEntity;
}
