import CreateCvPage from '@/components/cvs/create/CreateCvPage';
import {
  useGetCompaniesQuery,
  useGetEducationsQuery,
  useGetProjectsQuery,
  useGetSkillsQuery,
} from '@/graphql/generated/types';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/cvs/create')({
  component: CreateCvPageRoute,
});

function CreateCvPageRoute() {
  const {
    data: companies,
    error: companiesError,
    loading: companiesLoading,
  } = useGetCompaniesQuery();

  const {
    data: educations,
    error: educationsError,
    loading: educationsLoading,
  } = useGetEducationsQuery();

  const { data: projects, error: projectsError, loading: projectsLoading } = useGetProjectsQuery();
  const { data: skills, error: skillsError, loading: skillsLoading } = useGetSkillsQuery();

  if (companiesError || educationsError || projectsError || skillsError) {
    return <div>Error loading data</div>;
  }

  if (companiesLoading || educationsLoading || projectsLoading || skillsLoading) {
    return <div>Loading...</div>;
  }

  if (!companies?.companies || !educations?.educations || !projects?.projects || !skills?.skills) {
    return <div>No data available</div>;
  }

  return (
    <CreateCvPage
      allCompanies={companies.companies}
      allEducations={educations.educations}
      allProjects={projects.projects}
      allSkills={skills.skills}
    />
  );
}
