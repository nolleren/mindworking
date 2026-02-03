import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMemo, useState } from 'react';
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
} from '../../graphql/generated/types';
import { cvSchema, type CvFormData } from '../../schemas/cv.schema';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { RelationList } from '../../components/relations/RelationList';
import { useRelationCrud, type RelationEntity } from '../../hooks/relations/useRelationCrud';

export const Route = createFileRoute('/cvs/$id_/edit')({
  component: EditCvPage,
});

function EditCvPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();

  console.log('EditCvPage loaded with id:', id);

  const {
    data,
    loading: queryLoading,
    error,
  } = useGetCvQuery({
    variables: { id },
  });

  const { data: companiesData } = useGetCompaniesQuery();
  const { data: educationsData } = useGetEducationsQuery();
  const { data: projectsData } = useGetProjectsQuery();
  const { data: skillsData } = useGetSkillsQuery();

  const allCompanies = useMemo(
    () => (companiesData?.companies ?? []) as Company[],
    [companiesData]
  );
  const allEducations = useMemo(
    () => (educationsData?.educations ?? []) as Education[],
    [educationsData]
  );
  const allProjects = useMemo(() => (projectsData?.projects ?? []) as Project[], [projectsData]);
  const allSkills = useMemo(() => (skillsData?.skills ?? []) as Skill[], [skillsData]);

  // Local state for relations during editing - initialize with CV data
  const [selectedCompanies, setSelectedCompanies] = useState<Company[]>(
    () => (data?.cv?.companies ?? []) as Company[]
  );
  const [selectedEducations, setSelectedEducations] = useState<Education[]>(
    () => (data?.cv?.educations ?? []) as Education[]
  );
  const [selectedProjects, setSelectedProjects] = useState<Project[]>(
    () => (data?.cv?.projects ?? []) as Project[]
  );
  const [selectedSkills, setSelectedSkills] = useState<Skill[]>(
    () => (data?.cv?.skills ?? []) as Skill[]
  );

  const [updateCv] = useUpdateCvMutation({
    refetchQueries: ['GetCv', 'GetCvs'],
  });

  const { createEntity, updateEntity, getAvailableEntities } = useRelationCrud();

  const availableCompanies = getAvailableEntities(
    allCompanies,
    selectedCompanies.map((c) => c.id)
  );
  const availableEducations = getAvailableEntities(
    allEducations,
    selectedEducations.map((e) => e.id)
  );
  const availableProjects = getAvailableEntities(
    allProjects,
    selectedProjects.map((p) => p.id)
  );
  const availableSkills = getAvailableEntities(
    allSkills,
    selectedSkills.map((s) => s.id)
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CvFormData>({
    resolver: yupResolver(cvSchema),
    values: data?.cv
      ? {
          name: data.cv.name,
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
    const newCompanies = allCompanies.filter((c) => companyIds.includes(c.id));
    setSelectedCompanies((prev) => [...prev, ...newCompanies]);
  };

  const handleCreateCompany = async (data: unknown) => {
    console.log('CV.handleCreateCompany', data);
    const created = await createEntity('company', data as CompanyCreateInput);
    if (created) {
      setSelectedCompanies((prev) => [...prev, created as Company]);
    }
  };

  const handleEditCompany = async (_entity: RelationEntity, data: unknown) => {
    const updated = await updateEntity('company', data as CompanyUpsertInput);
    if (updated) {
      setSelectedCompanies((prev) =>
        prev.map((c) => (c.id === _entity.id ? (updated as Company) : c))
      );
    }
  };

  const handleDeleteCompany = async (companyId: string) => {
    setSelectedCompanies((prev) => prev.filter((c) => c.id !== companyId));
  };

  // Education handlers
  const handleAddEducations = async (educationIds: string[]) => {
    const newEducations = allEducations.filter((e) => educationIds.includes(e.id));
    setSelectedEducations((prev) => [...prev, ...newEducations]);
  };

  const handleCreateEducation = async (data: unknown) => {
    console.log('CV.handleCreateEducation', data);
    const created = await createEntity('education', data as EducationCreateInput);
    if (created) {
      setSelectedEducations((prev) => [...prev, created as Education]);
    }
  };

  const handleEditEducation = async (_entity: RelationEntity, data: unknown) => {
    const updated = await updateEntity('education', data as EducationUpsertInput);
    if (updated) {
      setSelectedEducations((prev) =>
        prev.map((e) => (e.id === _entity.id ? (updated as Education) : e))
      );
    }
  };

  const handleDeleteEducation = async (educationId: string) => {
    setSelectedEducations((prev) => prev.filter((e) => e.id !== educationId));
  };

  // Project handlers
  const handleAddProjects = async (projectIds: string[]) => {
    const newProjects = allProjects.filter((p) => projectIds.includes(p.id));
    setSelectedProjects((prev) => [...prev, ...newProjects]);
  };

  const handleCreateProject = async (data: unknown) => {
    console.log('CV.handleCreateProject', data);
    const created = await createEntity('project', data as ProjectCreateInput);
    if (created) {
      setSelectedProjects((prev) => [...prev, created as Project]);
    }
  };

  const handleEditProject = async (_entity: RelationEntity, data: unknown) => {
    const updated = await updateEntity('project', data as ProjectUpsertInput);
    if (updated) {
      setSelectedProjects((prev) =>
        prev.map((p) => (p.id === _entity.id ? (updated as Project) : p))
      );
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    setSelectedProjects((prev) => prev.filter((p) => p.id !== projectId));
  };

  // Skill handlers
  const handleAddSkills = async (skillIds: string[]) => {
    const newSkills = allSkills.filter((s) => skillIds.includes(s.id));
    setSelectedSkills((prev) => [...prev, ...newSkills]);
  };

  const handleCreateSkill = async (data: unknown) => {
    console.log('CV.handleCreateSkill', data);
    const created = await createEntity('skill', data as SkillCreateInput);
    if (created) {
      setSelectedSkills((prev) => [...prev, created as Skill]);
    }
  };

  const handleEditSkill = async (_entity: RelationEntity, data: unknown) => {
    const updated = await updateEntity('skill', data as SkillUpsertInput);
    if (updated) {
      setSelectedSkills((prev) => prev.map((s) => (s.id === _entity.id ? (updated as Skill) : s)));
    }
  };

  const handleDeleteSkill = async (skillId: string) => {
    setSelectedSkills((prev) => prev.filter((s) => s.id !== skillId));
  };

  if (queryLoading) {
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
