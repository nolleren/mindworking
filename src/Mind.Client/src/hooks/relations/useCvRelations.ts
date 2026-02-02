import { useCallback } from 'react';
import {
  useUpdateCvMutation,
  type UpdateCvInput,
  type Company,
  type Education,
  type Project,
  type Skill,
} from '../../graphql/generated/types';
import type { RelationType } from './types';

type EntityType = Company | Education | Project | Skill;

export interface AllRelations {
  companies: Company[];
  educations: Education[];
  projects: Project[];
  skills: Skill[];
}

export function useCvRelations(
  cvId: string | undefined,
  onSuccess?: () => void,
  onError?: (error: Error) => void
) {
  const [updateCvMutation] = useUpdateCvMutation({
    refetchQueries: ['GetCv'],
  });

  const attachToCV = useCallback(
    async (
      type: RelationType,
      entities: EntityType[],
      allRelations: AllRelations,
      cvName?: string
    ): Promise<boolean> => {
      if (!cvId) {
        console.error('Cannot attach to CV: cvId is not provided');
        return false;
      }

      try {
        const currentCvName = cvName ?? '';

        // Start with all existing relations
        const updatedRelations: AllRelations = { ...allRelations };

        // Update only the specific relation type
        switch (type) {
          case 'company':
            updatedRelations.companies = entities as Company[];
            break;
          case 'education':
            updatedRelations.educations = entities as Education[];
            break;
          case 'project':
            updatedRelations.projects = entities as Project[];
            break;
          case 'skill':
            updatedRelations.skills = entities as Skill[];
            break;
        }

        const input: UpdateCvInput = {
          id: cvId,
          name: currentCvName,
          companies: updatedRelations.companies.map((entity) => entity.id),
          educations: updatedRelations.educations.map((entity) => entity.id),
          projects: updatedRelations.projects.map((entity) => entity.id),
          skills: updatedRelations.skills.map((entity) => entity.id),
        };

        await updateCvMutation({
          variables: { input },
        });

        onSuccess?.();
        return true;
      } catch (error) {
        console.error(`Failed to attach ${type} to CV:`, error);
        onError?.(error as Error);
        return false;
      }
    },
    [cvId, updateCvMutation, onSuccess, onError]
  );

  const detachFromCV = useCallback(
    async (
      type: RelationType,
      entityIdToRemove: string,
      currentEntities: EntityType[],
      allRelations: AllRelations,
      cvName?: string
    ): Promise<boolean> => {
      if (!cvId) {
        console.error('Cannot detach from CV: cvId is not provided');
        return false;
      }

      try {
        const remainingEntities = currentEntities.filter(
          (entity) => entity.id !== entityIdToRemove
        );
        return await attachToCV(type, remainingEntities, allRelations, cvName);
      } catch (error) {
        console.error(`Failed to detach ${type} from CV:`, error);
        onError?.(error as Error);
        return false;
      }
    },
    [cvId, attachToCV, onError]
  );

  return { attachToCV, detachFromCV };
}
