import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { createRelationHandlers } from '../../hooks/relations/useGenericRelationHandlers';
import type {
  CompanyEntity,
  CreateInputMap,
  EducationEntity,
  ProjectEntity,
  RelationEntity,
  SkillEntity,
  UpdateInputMap,
} from '../../hooks/relations/types';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Dispatch, SetStateAction, useState } from 'react';
import {
  useGetCompaniesQuery,
  useGetCvQuery,
  useGetEducationsQuery,
  useGetProjectsQuery,
  useGetSkillsQuery,
  useUpdateCvMutation,
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
import { useRelationCrud } from '../../hooks/relations/useRelationCrud';

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

  // Generic relation handlers
  const companyHandlers = createRelationHandlers<'company'>({
    type: 'company',
    entities: selectedCompanies,
    setEntities: setSelectedCompanies as Dispatch<SetStateAction<RelationEntity[]>>,
    createEntity: (type, input) => createEntity(type, input),
    updateEntity: async (type, input) => {
      await updateEntity(type, input);
    },
  });
  const educationHandlers = createRelationHandlers<'education'>({
    type: 'education',
    entities: selectedEducations,
    setEntities: setSelectedEducations as Dispatch<SetStateAction<RelationEntity[]>>,
    createEntity: (type, input) => createEntity(type, input),
    updateEntity: async (type, input) => {
      await updateEntity(type, input);
    },
  });
  const projectHandlers = createRelationHandlers<'project'>({
    type: 'project',
    entities: selectedProjects,
    setEntities: setSelectedProjects as Dispatch<SetStateAction<RelationEntity[]>>,
    createEntity: (type, input) => createEntity(type, input),
    updateEntity: async (type, input) => {
      await updateEntity(type, input);
    },
  });
  const skillHandlers = createRelationHandlers<'skill'>({
    type: 'skill',
    entities: selectedSkills,
    setEntities: setSelectedSkills as Dispatch<SetStateAction<RelationEntity[]>>,
    createEntity: (type, input) => createEntity(type, input),
    updateEntity: async (type, input) => {
      await updateEntity(type, input);
    },
  });

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
          onAdd={async (ids) => {
            companyHandlers.handleAdd(ids);
          }}
          onCreate={async (data) => {
            await companyHandlers.handleCreate(data as CreateInputMap['company']);
          }}
          onEdit={async (entity, data) => {
            await companyHandlers.handleEdit(entity, data as UpdateInputMap['company']);
          }}
          onDelete={async (id) => {
            companyHandlers.handleDelete(id);
          }}
        />
      </Card>

      <Card>
        <RelationList
          type="education"
          entities={selectedEducations}
          availableEntities={availableEducations}
          onAdd={async (ids) => {
            educationHandlers.handleAdd(ids);
          }}
          onCreate={async (data) => {
            await educationHandlers.handleCreate(data as CreateInputMap['education']);
          }}
          onEdit={async (entity, data) => {
            await educationHandlers.handleEdit(entity, data as UpdateInputMap['education']);
          }}
          onDelete={async (id) => {
            educationHandlers.handleDelete(id);
          }}
        />
      </Card>

      <Card>
        <RelationList
          type="project"
          entities={selectedProjects}
          availableEntities={availableProjects}
          onAdd={async (ids) => {
            projectHandlers.handleAdd(ids);
          }}
          onCreate={async (data) => {
            await projectHandlers.handleCreate(data as CreateInputMap['project']);
          }}
          onEdit={async (entity, data) => {
            await projectHandlers.handleEdit(entity, data as UpdateInputMap['project']);
          }}
          onDelete={async (id) => {
            projectHandlers.handleDelete(id);
          }}
        />
      </Card>

      <Card>
        <RelationList
          type="skill"
          entities={selectedSkills}
          availableEntities={availableSkills}
          onAdd={async (ids) => {
            skillHandlers.handleAdd(ids);
          }}
          onCreate={async (data) => {
            await skillHandlers.handleCreate(data as CreateInputMap['skill']);
          }}
          onEdit={async (entity, data) => {
            await skillHandlers.handleEdit(entity, data as UpdateInputMap['skill']);
          }}
          onDelete={async (id) => {
            skillHandlers.handleDelete(id);
          }}
        />
      </Card>
    </div>
  );
}
