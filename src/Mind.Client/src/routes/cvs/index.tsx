import { createFileRoute, Link } from '@tanstack/react-router';
import { useGetCvsQuery, useDeleteCvMutation, Cv } from '../../graphql/generated/types';
import { Table } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { useState } from 'react';

export const Route = createFileRoute('/cvs/')({
  component: CvListPage,
});

function CvListPage() {
  const { data, loading, error } = useGetCvsQuery();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteCv] = useDeleteCvMutation();

  const formatDate = (value?: string | null) => {
    if (!value) return '—';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString('da-DK');
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Er du sikker på, at du vil slette dette CV?')) {
      try {
        setDeletingId(id);
        await deleteCv({
          variables: { id },
          optimisticResponse: {
            deleteCv: true,
          },
          update: (cache) => {
            cache.modify({
              fields: {
                cvs(existingRefs, { readField }) {
                  if (!Array.isArray(existingRefs)) {
                    return existingRefs;
                  }

                  return existingRefs.filter((ref) => readField('id', ref) !== id);
                },
              },
            });

            const cvCacheId = cache.identify({ __typename: 'Cv', id });
            if (cvCacheId) {
              cache.evict({ id: cvCacheId });
              cache.gc();
            }
          },
        });
      } catch (err) {
        console.error('Failed to delete CV:', err);
        alert('Kunne ikke slette CV');
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
        Fejl ved indlæsning af CV'er: {error.message}
      </div>
    );
  }

  const cvs = data?.cvs || [];

  const columns = [
    {
      header: 'Navn',
      accessor: 'name' as keyof Cv,
    },
    {
      header: 'Oprettet',
      accessor: (cv: Cv) => formatDate(cv.createdAt),
    },
    {
      header: 'Opdateret',
      accessor: (cv: Cv) => formatDate(cv.updatedAt),
    },
    {
      header: 'Antal virksomheder',
      accessor: (cv: Cv) => cv.companies?.length || 0,
    },
    {
      header: 'Antal uddannelser',
      accessor: (cv: Cv) => cv.educations?.length || 0,
    },
    {
      header: 'Antal projekter',
      accessor: (cv: Cv) => cv.projects?.length || 0,
    },
    {
      header: 'Antal skills',
      accessor: (cv: Cv) => cv.skills?.length || 0,
    },
    {
      header: 'Handlinger',
      accessor: (cv: Cv) => (
        <div className="flex gap-2">
          <Link to="/cvs/$id" params={{ id: cv.id }} onClick={(e) => e.stopPropagation()}>
            <Button size="sm" variant="secondary">
              Vis
            </Button>
          </Link>
          <Link to="/cvs/$id/edit" params={{ id: cv.id }} onClick={(e) => e.stopPropagation()}>
            <Button size="sm" variant="secondary">
              Rediger
            </Button>
          </Link>
          <Button
            size="sm"
            variant="danger"
            disabled={deletingId === cv.id}
            title={deletingId === cv.id ? 'Sletter…' : undefined}
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(cv.id);
            }}
          >
            Slet
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <Card
        title="CV'er"
        actions={
          <Link to="/cvs/create">
            <Button>Opret nyt CV</Button>
          </Link>
        }
      >
        <Table data={cvs as Cv[]} columns={columns} emptyMessage="Ingen CV'er fundet" />
      </Card>
    </div>
  );
}
