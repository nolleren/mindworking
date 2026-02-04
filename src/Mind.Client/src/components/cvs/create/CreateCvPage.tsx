import { CompanyRelationSection } from './CompanyRelationSection';
import { EducationRelationSection } from './EducationRelationSection';
import { ProjectRelationSection } from './ProjectRelationSection';
import { SkillRelationSection } from './SkillRelationSection';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { CreateCvInput } from '@/graphql/generated/types';
import {
  CompanyListItemEntity,
  EducationListItemEntity,
  ProjectListItemEntity,
  SkillListItemEntity,
} from '@/hooks/relations/types';
import { CvFormData, cvSchema } from '@/schemas/cv.schema';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from '@tanstack/react-router';
import { useCreateCvMutation } from '@/graphql/generated/types';
import { useForm } from 'react-hook-form';
import { useState } from 'react';

interface CvCreateProps {
  allCompanies: CompanyListItemEntity[];
  allEducations: EducationListItemEntity[];
  allProjects: ProjectListItemEntity[];
  allSkills: SkillListItemEntity[];
}

const CreateCvPage = ({ allCompanies, allEducations, allProjects, allSkills }: CvCreateProps) => {
  const navigate = useNavigate();
  const [createCv, { loading }] = useCreateCvMutation({
    refetchQueries: ['GetCvs'],
  });

  const [selectedEducations, setSelectedEducations] = useState<EducationListItemEntity[]>([]);
  const [selectedProjects, setSelectedProjects] = useState<ProjectListItemEntity[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<SkillListItemEntity[]>([]);
  const [selectedCompanies, setSelectedCompanies] = useState<CompanyListItemEntity[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CvFormData>({
    resolver: yupResolver(cvSchema),
  });

  const onSubmit = handleSubmit(async (data) => {
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
  });

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
      <CompanyRelationSection
        allCompanies={allCompanies}
        selected={selectedCompanies}
        onChange={setSelectedCompanies}
      />
      <EducationRelationSection
        allEducations={allEducations}
        selected={selectedEducations}
        onChange={setSelectedEducations}
      />
      <ProjectRelationSection
        allProjects={allProjects}
        selected={selectedProjects}
        onChange={setSelectedProjects}
      />
      <SkillRelationSection
        allSkills={allSkills}
        selected={selectedSkills}
        onChange={setSelectedSkills}
      />
    </div>
  );
};

export default CreateCvPage;
