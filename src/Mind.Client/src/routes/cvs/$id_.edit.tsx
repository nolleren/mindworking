import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from 'react';
import {
  useGetCompaniesQuery,
  useGetCvQuery,
  useGetEducationsQuery,
  useGetProjectsQuery,
  useGetSkillsQuery,
  useUpdateCvMutation,
  type Company,
  type Education,
  type Project,
  type Skill,
  type CompanyCreateInput,
  type EducationCreateInput,
  type ProjectCreateInput,
  type SkillCreateInput,
  type CompanyUpsertInput,
  type EducationUpsertInput,
  type ProjectUpsertInput,
  type SkillUpsertInput,
  type UpdateCvInput,
  GetCvQuery,
  GetCompaniesQuery,
  GetEducationsQuery,
  GetProjectsQuery,
  GetSkillsQuery,
} from '../../graphql/generated/types';
import { cvSchema, type CvFormData } from '../../schemas/cv.schema';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { RelationList } from '../../components/relations/RelationList';
import { useRelationCrud, type RelationEntity } from '../../hooks/relations/useRelationCrud';

export const Route = createFileRoute('/cvs/$id_/edit')({
  component: EditCvPageContainer,
});

function EditCvPageContainer() {
  const { id } = Route.useParams();
  const navigate = useNavigate();

  const { data, loading: queryLoading, error } = useGetCvQuery({ variables: { id } });
  const { data: companiesData } = useGetCompaniesQuery();
  const { data: educationsData } = useGetEducationsQuery();
  const { data: projectsData } = useGetProjectsQuery();
  const { data: skillsData } = useGetSkillsQuery();

  // Show loading if any query is still loading
  const isLoading =
    queryLoading || !companiesData || !educationsData || !projectsData || !skillsData;
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">Indlæser...</div>
      </div>
    );
  }
  if (error || !data?.cv) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-600">Kunne ikke indlæse CV</div>
      </div>
    );
  }

  return (
    <EditCvPage
      cv={data.cv}
      companies={companiesData?.companies ?? []}
      educations={educationsData?.educations ?? []}
      projects={projectsData?.projects ?? []}
      skills={skillsData?.skills ?? []}
      navigate={navigate}
      id={id}
    />
  );
}

type EditCvPageProps = {
  cv: GetCvQuery['cv'];
  companies: GetCompaniesQuery['companies'];
  educations: GetEducationsQuery['educations'];
  projects: GetProjectsQuery['projects'];
  skills: GetSkillsQuery['skills'];
  navigate: ReturnType<typeof useNavigate>;
  id: string;
};

function EditCvPage({
  cv,
  companies,
  educations,
  projects,
  skills,
  navigate,
  id,
}: EditCvPageProps) {
  type CompanyEntity = NonNullable<NonNullable<Required<GetCvQuery>['cv']>['companies']>[number];
  type EducationEntity = NonNullable<NonNullable<Required<GetCvQuery>['cv']>['educations']>[number];
  type ProjectEntity = NonNullable<NonNullable<Required<GetCvQuery>['cv']>['projects']>[number];
  type SkillEntity = NonNullable<NonNullable<Required<GetCvQuery>['cv']>['skills']>[number];

  // Local state for relations during editing
  const [selectedCompanies, setSelectedCompanies] = useState<CompanyEntity[]>(cv?.companies ?? []);
  const [selectedEducations, setSelectedEducations] = useState<EducationEntity[]>(
    cv?.educations ?? []
  );
  const [selectedProjects, setSelectedProjects] = useState<ProjectEntity[]>(cv?.projects ?? []);
  const [selectedSkills, setSelectedSkills] = useState<SkillEntity[]>(cv?.skills ?? []);

  const [updateCv] = useUpdateCvMutation({
    refetchQueries: ['GetCv', 'GetCvs'],
  });

  const { createEntity, updateEntity, getAvailableEntities } = useRelationCrud();

  const availableCompanies = getAvailableEntities(
    companies,
    selectedCompanies.map((c) => c.id)
  );
  const availableEducations = getAvailableEntities(
    educations,
    selectedEducations.map((e) => e.id)
  );
  const availableProjects = getAvailableEntities(
    projects,
    selectedProjects.map((p) => p.id)
  );
  const availableSkills = getAvailableEntities(
    skills,
    selectedSkills.map((s) => s.id)
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CvFormData>({
    resolver: yupResolver(cvSchema),
    values: cv
      ? {
          name: cv.name,
        }
      : undefined,
  });

  const onSubmit = handleSubmit(async (formData) => {
    console.log('Form submitted!', formData);
    try {
      const input: UpdateCvInput = {
        id,
        name: formData.name,
        companies: selectedCompanies.map((c) => c.id),
        educations: selectedEducations.map((e) => e.id),
        projects: selectedProjects.map((p) => p.id),
        skills: selectedSkills.map((s) => s.id),
      };

      await updateCv({ variables: { input } });
      navigate({ to: '/cvs' });
    } catch (err) {
      console.error('Failed to update CV:', err);
      alert('Kunne ikke opdatere CV');
    }
  });

  // Company handlers
  const handleAddCompanies = async (companyIds: string[]) => {
    const newCompanies = companies.filter((c) => companyIds.includes(c.id));
    setSelectedCompanies((prev) => [...prev, ...newCompanies]);
  };

  const handleCreateCompany = async (data: unknown) => {
    const created = await createEntity('company', data as CompanyCreateInput);
    if (created) {
      setSelectedCompanies((prev) => [...prev, created as Company]);
    }
  };

  const handleEditCompany = async (_entity: RelationEntity, data: unknown) => {
    await updateEntity('company', data as CompanyUpsertInput);
  };

  const handleDeleteCompany = async (companyId: string) => {
    setSelectedCompanies((prev) => prev.filter((c) => c.id !== companyId));
  };

  // Education handlers
  const handleAddEducations = async (educationIds: string[]) => {
    const newEducations = educations.filter((e) => educationIds.includes(e.id));
    setSelectedEducations((prev) => [...prev, ...newEducations]);
  };

  const handleCreateEducation = async (data: unknown) => {
    const created = await createEntity('education', data as EducationCreateInput);
    if (created) {
      setSelectedEducations((prev) => [...prev, created as Education]);
    }
  };

  const handleEditEducation = async (_entity: RelationEntity, data: unknown) => {
    await updateEntity('education', data as EducationUpsertInput);
  };

  const handleDeleteEducation = async (educationId: string) => {
    setSelectedEducations((prev) => prev.filter((e) => e.id !== educationId));
  };

  // Project handlers
  const handleAddProjects = async (projectIds: string[]) => {
    const newProjects = projects.filter((p) => projectIds.includes(p.id));
    setSelectedProjects((prev) => [...prev, ...newProjects]);
  };

  const handleCreateProject = async (data: unknown) => {
    const created = await createEntity('project', data as ProjectCreateInput);
    if (created) {
      setSelectedProjects((prev) => [...prev, created as Project]);
    }
  };

  const handleEditProject = async (_entity: RelationEntity, data: unknown) => {
    await updateEntity('project', data as ProjectUpsertInput);
  };

  const handleDeleteProject = async (projectId: string) => {
    setSelectedProjects((prev) => prev.filter((p) => p.id !== projectId));
  };

  // Skill handlers
  const handleAddSkills = async (skillIds: string[]) => {
    const newSkills = skills.filter((s) => skillIds.includes(s.id));
    setSelectedSkills((prev) => [...prev, ...newSkills]);
  };

  const handleCreateSkill = async (data: unknown) => {
    const created = await createEntity('skill', data as SkillCreateInput);
    if (created) {
      setSelectedSkills((prev) => [...prev, created as Skill]);
    }
  };

  const handleEditSkill = async (_entity: RelationEntity, data: unknown) => {
    await updateEntity('skill', data as SkillUpsertInput);
  };

  const handleDeleteSkill = async (skillId: string) => {
    setSelectedSkills((prev) => prev.filter((s) => s.id !== skillId));
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Rediger CV</h1>
        <Button variant="secondary" onClick={() => navigate({ to: '/cvs' })}>
          Tilbage
        </Button>
      </div>

      <Card>
        <form onSubmit={onSubmit} className="space-y-6">
          <Input label="CV Navn" error={errors.name?.message} {...register('name')} required />

          <div className="flex justify-end gap-3">
            <Button type="button" variant="secondary" onClick={() => navigate({ to: '/cvs' })}>
              Annuller
            </Button>
            <Button type="submit">Gem CV</Button>
          </div>
        </form>
      </Card>

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

      <Card>
        <RelationList
          type="education"
          entities={selectedEducations}
          availableEntities={availableEducations}
          onAdd={handleAddEducations}
          onCreate={handleCreateEducation}
          onEdit={handleEditEducation}
          onDelete={handleDeleteEducation}
        />
      </Card>

      <Card>
        <RelationList
          type="project"
          entities={selectedProjects}
          availableEntities={availableProjects}
          onAdd={handleAddProjects}
          onCreate={handleCreateProject}
          onEdit={handleEditProject}
          onDelete={handleDeleteProject}
        />
      </Card>

      <Card>
        <RelationList
          type="skill"
          entities={selectedSkills}
          availableEntities={availableSkills}
          onAdd={handleAddSkills}
          onCreate={handleCreateSkill}
          onEdit={handleEditSkill}
          onDelete={handleDeleteSkill}
        />
      </Card>
    </div>
  );
}
