import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useGetCvQuery } from '../../graphql/generated/types';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

export const Route = createFileRoute('/cvs/$id')({
  component: CvDetailsPage,
});

function formatDateTime(value?: string | null) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString('da-DK');
}

function CvDetailsPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();

  const { data, loading, error } = useGetCvQuery({
    variables: { id },
  });

  if (loading && !data) {
    return <div className="flex justify-center items-center h-64">Indlæser...</div>;
  }

  if (error) {
    return (
      <div className="text-red-600 text-center p-4">Fejl ved indlæsning af CV: {error.message}</div>
    );
  }

  const cv = data?.cv;

  if (!cv) {
    return <div className="text-center p-4">CV blev ikke fundet</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <Card
        title={cv.name}
        actions={
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => navigate({ to: '/cvs' })}>
              Tilbage
            </Button>
            <Link to="/cvs/$id/edit" params={{ id: cv.id }}>
              <Button>Rediger CV & relationer</Button>
            </Link>
          </div>
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-gray-500">Oprettet</div>
            <div className="font-medium">{formatDateTime(cv.createdAt)}</div>
          </div>
          <div>
            <div className="text-gray-500">Opdateret</div>
            <div className="font-medium">{formatDateTime(cv.updatedAt)}</div>
          </div>
        </div>
      </Card>

      <Card title="Virksomheder">
        {cv.companies?.length ? (
          <ul className="divide-y">
            {cv.companies.map((company) => (
              <li key={company.id} className="py-3">
                <div className="font-medium">{company.name}</div>
                <div className="text-sm text-gray-600 mt-1">
                  {[company.address, company.zipCode, company.city].filter(Boolean).join(', ') ||
                    '—'}
                </div>
                {company.description && (
                  <div className="text-sm text-gray-600 mt-1">{company.description}</div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-gray-600">Ingen virksomheder tilknyttet</div>
        )}
      </Card>

      <Card title="Uddannelser">
        {cv.educations?.length ? (
          <ul className="divide-y">
            {cv.educations.map((education) => (
              <li key={education.id} className="py-3">
                <div className="font-medium">{education.name}</div>
                <div className="text-sm text-gray-600 mt-1">
                  {[education.address, education.zipCode, education.city]
                    .filter(Boolean)
                    .join(', ') || '—'}
                </div>
                {education.description && (
                  <div className="text-sm text-gray-600 mt-1">{education.description}</div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-gray-600">Ingen uddannelser tilknyttet</div>
        )}
      </Card>

      <Card title="Projekter">
        {cv.projects?.length ? (
          <ul className="divide-y">
            {cv.projects.map((project) => (
              <li key={project.id} className="py-3">
                <div className="font-medium">{project.name}</div>
                <div className="text-sm text-gray-600 mt-1">
                  {[
                    project.startDate ? `Start: ${formatDateTime(project.startDate)}` : null,
                    project.endDate ? `Slut: ${formatDateTime(project.endDate)}` : null,
                  ]
                    .filter(Boolean)
                    .join(' · ') || '—'}
                </div>
                {project.description && (
                  <div className="text-sm text-gray-600 mt-1">{project.description}</div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-gray-600">Ingen projekter tilknyttet</div>
        )}
      </Card>

      <Card title="Kompetencer">
        {cv.skills?.length ? (
          <ul className="divide-y">
            {cv.skills.map((skill) => (
              <li key={skill.id} className="py-3">
                <div className="font-medium">{skill.name}</div>
                <div className="text-sm text-gray-600 mt-1">Niveau: {skill.levelOfMastery}</div>
                {skill.description && (
                  <div className="text-sm text-gray-600 mt-1">{skill.description}</div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-gray-600">Ingen kompetencer tilknyttet</div>
        )}
      </Card>
    </div>
  );
}
