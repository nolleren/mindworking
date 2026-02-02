import { useState } from 'react';
import { Button } from '../ui/Button';
import { RelationItem } from './RelationItem';
import { RelationModal } from './RelationModal';
import type { RelationEntity, RelationType } from '../../hooks/relations/types';

interface RelationListProps {
  type: RelationType;
  entities: RelationEntity[];
  availableEntities: RelationEntity[];
  onAdd: (entityIds: string[]) => Promise<void>;
  onCreate: (data: unknown) => Promise<void>;
  onEdit: (entity: RelationEntity, data: unknown) => Promise<void>;
  onDelete: (entityId: string) => Promise<void>;
}

const typeLabels: Record<RelationType, { singular: string; plural: string }> = {
  company: { singular: 'virksomhed', plural: 'Virksomheder' },
  education: { singular: 'uddannelse', plural: 'Uddannelser' },
  project: { singular: 'projekt', plural: 'Projekter' },
  skill: { singular: 'færdighed', plural: 'Færdigheder' },
};

export function RelationList({
  type,
  entities,
  availableEntities,
  onAdd,
  onCreate,
  onEdit,
  onDelete,
}: RelationListProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'select'>('select');
  const [editingEntity, setEditingEntity] = useState<RelationEntity | undefined>();

  const labels = typeLabels[type];

  const handleOpenAdd = () => {
    console.log('handleOpenAdd called');
    setModalMode('select');
    setEditingEntity(undefined);
    setModalOpen(true);
    console.log('Modal should be open now');
  };

  const handleEdit = (entity: RelationEntity) => {
    setModalMode('edit');
    setEditingEntity(entity);
    setModalOpen(true);
  };

  const handleModalSubmit = async (data: unknown) => {
    if (modalMode === 'edit' && editingEntity) {
      const editData = { ...(data as Record<string, unknown>), id: editingEntity.id };
      await onEdit(editingEntity, editData);
    } else if (modalMode === 'create') {
      await onCreate(data);
    }
    setModalOpen(false);
    setEditingEntity(undefined);
  };

  const handleModalSelect = async (entityIds: string[]) => {
    await onAdd(entityIds);
    setModalOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">{labels.plural}</h3>
        <Button onClick={handleOpenAdd} size="sm">
          Tilføj {labels.singular}
        </Button>
      </div>

      {entities.length === 0 ? (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <p className="text-gray-500">Ingen {labels.plural.toLowerCase()} tilføjet</p>
          <Button onClick={handleOpenAdd} variant="secondary" className="mt-4">
            Tilføj {labels.singular}
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {entities.map((entity) => (
            <RelationItem
              key={entity.id}
              entity={entity}
              type={type}
              onEdit={handleEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}

      <RelationModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingEntity(undefined);
        }}
        type={type}
        mode={modalMode}
        entity={editingEntity}
        availableEntities={availableEntities}
        onSubmit={handleModalSubmit}
        onSelect={handleModalSelect}
      />
    </div>
  );
}
