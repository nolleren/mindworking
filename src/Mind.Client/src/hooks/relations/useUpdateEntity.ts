import { useCallback } from 'react';
import {
  useUpdateCompanyMutation,
  useUpdateEducationMutation,
  useUpdateProjectMutation,
  useUpdateSkillMutation,
} from '../../graphql/generated/types';
import type { UpdateInputMap, RelationType, RelationEntity } from './types';

export function useUpdateEntity(onError?: (error: Error) => void) {
  const [updateCompanyMutation] = useUpdateCompanyMutation();
  const [updateEducationMutation] = useUpdateEducationMutation();
  const [updateProjectMutation] = useUpdateProjectMutation();
  const [updateSkillMutation] = useUpdateSkillMutation();

  const updateEntity = useCallback(
    async <T extends RelationType>(
      type: T,
      input: UpdateInputMap[T]
    ): Promise<RelationEntity | null> => {
      try {
        switch (type) {
          case 'company': {
            const companyInput = input as UpdateInputMap['company'];
            const result = await updateCompanyMutation({ variables: { input: companyInput } });
            return (result.data?.updateCompany ?? null) as RelationEntity | null;
          }

          case 'education': {
            const educationInput = input as UpdateInputMap['education'];
            const result = await updateEducationMutation({ variables: { input: educationInput } });
            return (result.data?.updateEducation ?? null) as RelationEntity | null;
          }

          case 'project': {
            const projectInput = input as UpdateInputMap['project'];
            const result = await updateProjectMutation({ variables: { input: projectInput } });
            return (result.data?.updateProject ?? null) as RelationEntity | null;
          }

          case 'skill': {
            const skillInput = input as UpdateInputMap['skill'];
            const result = await updateSkillMutation({ variables: { input: skillInput } });
            return (result.data?.updateSkill ?? null) as RelationEntity | null;
          }

          default:
            throw new Error(`Unknown relation type: ${type}`);
        }
      } catch (error) {
        console.error(`Failed to update ${type}:`, error);
        onError?.(error as Error);
        return null;
      }
    },
    [
      updateCompanyMutation,
      updateEducationMutation,
      updateProjectMutation,
      updateSkillMutation,
      onError,
    ]
  );

  return updateEntity;
}
