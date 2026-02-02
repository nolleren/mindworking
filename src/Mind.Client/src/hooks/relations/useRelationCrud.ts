import { useCallback } from 'react';
import { useCreateEntity } from './useCreateEntity';
import { useUpdateEntity } from './useUpdateEntity';
import { useCvRelations } from './useCvRelations';
import type { UseRelationCrudOptions, RelationEntity } from './types';

export * from './types';

export function useRelationCrud(options: UseRelationCrudOptions = {}) {
  const { cvId, onSuccess, onError } = options;

  const createEntity = useCreateEntity(onError);
  const updateEntity = useUpdateEntity(onError);
  const { attachToCV, detachFromCV } = useCvRelations(cvId, onSuccess, onError);

  const getAvailableEntities = useCallback(
    (allEntities: RelationEntity[], attachedEntityIds: string[]): RelationEntity[] => {
      return allEntities.filter((entity) => !attachedEntityIds.includes(entity.id));
    },
    []
  );

  return {
    createEntity,
    updateEntity,
    attachToCV,
    detachFromCV,
    getAvailableEntities,
  };
}
