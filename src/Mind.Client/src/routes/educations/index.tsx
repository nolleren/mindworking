import { EducationListPage } from '@/components/education/list/EducationListPage';
import { useGetEducationsQuery } from '@/graphql/generated/types';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/educations/')({
  component: EducationListRoute,
});

function EducationListRoute() {
  const { data, loading, error } = useGetEducationsQuery();

  if (loading && !data) {
    return <div className="flex justify-center items-center h-64">Indlæser...</div>;
  }

  if (error) {
    return (
      <div className="text-red-600 text-center p-4">
        Fejl ved indlæsning af uddannelser: {error.message}
      </div>
    );
  }

  if (!data?.educations) {
    return <div className="text-center p-4">Ingen uddannelser fundet.</div>;
  }

  return <EducationListPage educations={data.educations} />;
}
