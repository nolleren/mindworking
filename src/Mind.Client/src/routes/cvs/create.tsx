import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useState, useMemo } from 'react';
import {
  useCreateCvMutation,
  useGetCompaniesQuery,
  useGetEducationsQuery,
  useGetProjectsQuery,
  useGetSkillsQuery,
  type Company,
  type Education,
  type Project,
  type Skill,
  type CreateCvInput,
  type CompanyCreateInput,
  type EducationCreateInput,
  type ProjectCreateInput,
  type SkillCreateInput,
  type CompanyUpsertInput,
  type EducationUpsertInput,
  type ProjectUpsertInput,
  type SkillUpsertInput,
} from '../../graphql/generated/types';
import { cvSchema, type CvFormData } from '../../schemas/cv.schema';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { RelationList } from '../../components/relations/RelationList';
import { useRelationCrud, type RelationEntity } from '../../hooks/relations/useRelationCrud';

export const Route = createFileRoute('/cvs/create')({
  component: CreateCvPage,
});

function CreateCvPage() {
  const navigate = useNavigate();
  const [createCv, { loading }] = useCreateCvMutation({
    refetchQueries: ['GetCvs'],
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

  // Local state for relations during creation
  const [selectedCompanies, setSelectedCompanies] = useState<Company[]>([]);
  const [selectedEducations, setSelectedEducations] = useState<Education[]>([]);
  const [selectedProjects, setSelectedProjects] = useState<Project[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<Skill[]>([]);

  const { createEntity, getAvailableEntities } = useRelationCrud();

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
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      const input: CreateCvInput = {
        name: data.name,
        companies: selectedCompanies.map((c) => c.id),
        educations: selectedEducations.map((e) => e.id),
        projects: selectedProjects.map((p) => p.id),
        skills: selectedSkills.map((s) => s.id),
      };

      const result = await createCv({ variables: { input } });
      const id = result.data?.createCv.id;

      if (id) {
        navigate({ to: '/cvs/$id', params: { id } });
      } else {
        navigate({ to: '/cvs' });
      }
    } catch (err) {
      console.error('Failed to create CV:', err);
      alert('Kunne ikke oprette CV');
    }
  });

  // Company handlers
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
    const updated = await createEntity('company', data as CompanyUpsertInput);
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
    const educations = allEducations.filter((e) => educationIds.includes(e.id));
    setSelectedEducations((prev) => [...prev, ...educations]);
  };

  const handleCreateEducation = async (data: unknown) => {
    const created = await createEntity('education', data as EducationCreateInput);
    if (created) {
      setSelectedEducations((prev) => [...prev, created as Education]);
    }
  };

  const handleEditEducation = async (_entity: RelationEntity, data: unknown) => {
    const updated = await createEntity('education', data as EducationUpsertInput);
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
    const projects = allProjects.filter((p) => projectIds.includes(p.id));
    setSelectedProjects((prev) => [...prev, ...projects]);
  };

  const handleCreateProject = async (data: unknown) => {
    const created = await createEntity('project', data as ProjectCreateInput);
    if (created) {
      setSelectedProjects((prev) => [...prev, created as Project]);
    }
  };

  const handleEditProject = async (_entity: RelationEntity, data: unknown) => {
    const updated = await createEntity('project', data as ProjectUpsertInput);
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
    const skills = allSkills.filter((s) => skillIds.includes(s.id));
    setSelectedSkills((prev) => [...prev, ...skills]);
  };

  const handleCreateSkill = async (data: unknown) => {
    const created = await createEntity('skill', data as SkillCreateInput);
    if (created) {
      setSelectedSkills((prev) => [...prev, created as Skill]);
    }
  };

  const handleEditSkill = async (_entity: RelationEntity, data: unknown) => {
    const updated = await createEntity('skill', data as SkillUpsertInput);
    if (updated) {
      setSelectedSkills((prev) => prev.map((s) => (s.id === _entity.id ? (updated as Skill) : s)));
    }
  };

  const handleDeleteSkill = async (skillId: string) => {
    setSelectedSkills((prev) => prev.filter((s) => s.id !== skillId));
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Opret nyt CV</h1>
        <Button variant="secondary" onClick={() => navigate({ to: '/cvs' })}>
          Tilbage
        </Button>
      </div>

      <Card>
        <form onSubmit={onSubmit} className="space-y-6">
          <Input
            label="CV Navn"
            {...register('name')}
            error={errors.name?.message}
            required
            placeholder="Indtast CV navn"
          />

          <div className="flex gap-4 justify-end pt-4">
            <Button type="button" variant="secondary" onClick={() => navigate({ to: '/cvs' })}>
              Annuller
            </Button>
            <Button type="submit" isLoading={loading}>
              Opret CV
            </Button>
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
