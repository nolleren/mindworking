import { Card } from '@/components/ui/Card';
import { RelationList } from '@/components/relations/RelationList';
import { Company, CompanyCreateInput, CompanyUpsertInput } from '@/graphql/generated/types';
import { useRelationCrud } from '@/hooks/relations/useRelationCrud';
import type { CompanyListItemEntity, RelationEntity } from '@/hooks/relations/types';
import { useEffect, useState } from 'react';

interface CompanyRelationSectionProps {
  allCompanies: CompanyListItemEntity[];
  selected: CompanyListItemEntity[];
  onChange: (companies: CompanyListItemEntity[]) => void;
}

export function CompanyRelationSection({
  allCompanies,
  selected,
  onChange,
}: CompanyRelationSectionProps) {
  const [selectedCompanies, setSelectedCompanies] = useState<CompanyListItemEntity[]>(selected);
  const { createEntity, updateEntity, getAvailableEntities } = useRelationCrud();

  useEffect(() => {
    onChange(selectedCompanies);
  }, [selectedCompanies, onChange]);

  const availableCompanies = getAvailableEntities(
    allCompanies,
    selectedCompanies.map((c) => c.id)
  );

  const handleAddCompanies = async (companyIds: string[]) => {
    const companies = allCompanies.filter((c) => companyIds.includes(c.id));
    setSelectedCompanies((prev) => [...prev, ...companies]);
  };

  const handleCreateCompany = async (data: unknown) => {
    const created = await createEntity('company', data as CompanyCreateInput);
    if (created) {
      setSelectedCompanies((prev) => [...prev, created as Company]);
    }
  };

  const handleEditCompany = async (_entity: RelationEntity, data: unknown) => {
    const updated = await updateEntity('company', data as CompanyUpsertInput);
    if (updated) {
      setSelectedCompanies((prev) =>
        prev.map((c) =>
          'id' in c && 'id' in _entity && c.id === _entity.id ? (updated as Company) : c
        )
      );
    }
  };

  const handleDeleteCompany = async (companyId: string) => {
    setSelectedCompanies((prev) => prev.filter((c) => 'id' in c && c.id !== companyId));
  };

  return (
    <Card>
      <RelationList
        type="company"
        entities={selectedCompanies}
        availableEntities={availableCompanies}
        onAdd={handleAddCompanies}
        onCreate={handleCreateCompany}
        onEdit={handleEditCompany}
        onDelete={handleDeleteCompany}
      />
    </Card>
  );
}
