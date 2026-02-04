import { Dispatch, SetStateAction } from 'react';
import type { RelationType, CreateInputMap, UpdateInputMap, RelationEntity } from './types';

export function createRelationHandlers<T extends RelationType>({
  type,
  entities,
  setEntities,
  createEntity,
  updateEntity,
}: {
  type: T;
  entities: RelationEntity[];
  setEntities: Dispatch<SetStateAction<RelationEntity[]>>;
  createEntity: (type: T, input: CreateInputMap[T]) => Promise<RelationEntity | null>;
  updateEntity: (type: T, input: UpdateInputMap[T]) => Promise<void>;
}) {
  return {
    handleAdd: (ids: string[]) => {
      const newItems = entities.filter((e) => ids.includes(e.id));
      setEntities((prev) => [...prev, ...newItems]);
    },
    handleCreate: async (data: CreateInputMap[T]) => {
      const created = await createEntity(type, data);
      if (created) setEntities((prev) => [...prev, created]);
    },
    handleEdit: async (_entity: RelationEntity, data: UpdateInputMap[T]) => {
      await updateEntity(type, data);
    },
    handleDelete: (id: string) => {
      setEntities((prev) => prev.filter((e) => e.id !== id));
    },
  };
}
