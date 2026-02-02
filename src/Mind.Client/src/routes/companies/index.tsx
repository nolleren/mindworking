import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import {
  useGetCompaniesQuery,
  useDeleteCompanyMutation,
  useCreateCompanyMutation,
  useUpdateCompanyMutation,
  type Company,
  type CompanyUpsertInput,
  type CompanyCreateInput,
} from '../../graphql/generated/types';
import { Table } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { RelationModal } from '../../components/relations/RelationModal';

export const Route = createFileRoute('/companies/')({
  component: CompanyListPage,
});

function CompanyListPage() {
  const { data, loading, error } = useGetCompaniesQuery();
  const [deleteCompany] = useDeleteCompanyMutation();
  const [createCompany] = useCreateCompanyMutation();
  const [updateCompany] = useUpdateCompanyMutation();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);

  const handleCreate = () => {
    setEditingCompany(null);
    setIsModalOpen(true);
  };

  const handleEdit = (company: Company) => {
    setEditingCompany(company);
    setIsModalOpen(true);
  };

  const handleSubmit = async (formData: unknown) => {
    try {
      if (editingCompany) {
        await updateCompany({
          variables: { input: formData as CompanyUpsertInput },
          refetchQueries: ['GetCompanies'],
        });
      } else {
        await createCompany({
          variables: { input: formData as CompanyCreateInput },
          refetchQueries: ['GetCompanies'],
        });
      }
      setIsModalOpen(false);
      setEditingCompany(null);
    } catch (err) {
      console.error('Failed to save company:', err);
      alert('Kunne ikke gemme virksomhed');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Er du sikker på, at du vil slette denne virksomhed?')) {
      setDeletingId(id);
      try {
        await deleteCompany({
          variables: { id },
          optimisticResponse: {
            deleteCompany: true,
          },
          update: (cache) => {
            cache.modify({
              fields: {
                companies(existingRefs, { readField }) {
                  if (!Array.isArray(existingRefs)) {
                    return existingRefs;
                  }

                  return existingRefs.filter((ref) => readField('id', ref) !== id);
                },
              },
            });

            const cacheId = cache.identify({ __typename: 'Company', id });
            if (cacheId) {
              cache.evict({ id: cacheId });
              cache.gc();
            }
          },
        });
      } catch (err) {
        console.error('Failed to delete company:', err);
        alert('Kunne ikke slette virksomhed');
      } finally {
        setDeletingId(null);
      }
    }
  };

  if (loading && !data) {
    return <div className="flex justify-center items-center h-64">Indlæser...</div>;
  }

  if (error) {
    return (
      <div className="text-red-600 text-center p-4">
        Fejl ved indlæsning af virksomheder: {error.message}
      </div>
    );
  }

  const companies = data?.companies || [];

  const columns = [
    {
      header: 'Navn',
      accessor: 'name' as keyof Company,
    },
    {
      header: 'Adresse',
      accessor: (company: Company) => company.address ?? '',
      className: 'whitespace-nowrap',
    },
    {
      header: 'Postnr',
      accessor: (company: Company) => company.zipCode ?? '',
      className: 'whitespace-nowrap',
    },
    {
      header: 'By',
      accessor: 'city' as keyof Company,
      className: 'whitespace-nowrap',
    },
    {
      header: 'Beskrivelse',
      accessor: (company: Company) => (
        <span className="block max-w-md truncate" title={company.description ?? ''}>
          {company.description ?? ''}
        </span>
      ),
      className: 'max-w-md',
    },
    {
      header: 'Handlinger',
      accessor: (company: Company) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(company);
            }}
          >
            Rediger
          </Button>
          <span
            className="inline-block"
            title={
              company.canDelete === false
                ? "Kan ikke slettes, fordi den bruges i et eller flere CV'er."
                : undefined
            }
          >
            <Button
              size="sm"
              variant="danger"
              title={
                company.canDelete === false
                  ? "Kan ikke slettes, fordi den bruges i et eller flere CV'er."
                  : undefined
              }
              disabled={company.canDelete === false || deletingId === company.id}
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(company.id);
              }}
            >
              Slet
            </Button>
          </span>
        </div>
      ),
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <Card
        title="Virksomheder"
        actions={<Button onClick={handleCreate}>Opret ny virksomhed</Button>}
      >
        <Table
          data={companies as Company[]}
          columns={columns}
          emptyMessage="Ingen virksomheder fundet"
        />
      </Card>

      <RelationModal
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingCompany(null);
        }}
        type="company"
        mode={editingCompany ? 'edit' : 'create'}
        entity={editingCompany || undefined}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
