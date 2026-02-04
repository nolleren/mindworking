import { CompanyFormData } from '@/schemas/company.schema';
import { EducationFormData } from '@/schemas/education.schema';
import { ProjectFormData } from '@/schemas/project.schema';
import { SkillFormData } from '@/schemas/skill.schema';
import type {
  CompanyCreateInput,
  EducationCreateInput,
  ProjectCreateInput,
  SkillCreateInput,
  CompanyUpsertInput,
  EducationUpsertInput,
  ProjectUpsertInput,
  SkillUpsertInput,
  GetCvQuery,
  Company,
  Education,
  Project,
  Skill,
  GetEducationsQuery,
  GetCompaniesQuery,
  GetProjectsQuery,
  GetSkillsQuery,
} from '../../graphql/generated/types';

export type ModalMode = 'create' | 'edit';

export type RelationType = 'company' | 'education' | 'project' | 'skill';

export type RelationEntity =
  | CompanyListItemEntity
  | EducationListItemEntity
  | ProjectListItemEntity
  | SkillListItemEntity;

export type CreateInputMap = {
  company: CompanyCreateInput;
  education: EducationCreateInput;
  project: ProjectCreateInput;
  skill: SkillCreateInput;
};

export type GenericRelationModalProps =
  | {
      type: 'company';
      open: boolean;
      onClose: () => void;
      mode: ModalMode;
      entity?: Company;
      onSubmit: (data: CompanyCreateInput | CompanyUpsertInput) => Promise<void>;
    }
  | {
      type: 'education';
      open: boolean;
      onClose: () => void;
      mode: ModalMode;
      entity?: Education;
      onSubmit: (data: EducationCreateInput | EducationUpsertInput) => Promise<void>;
    }
  | {
      type: 'project';
      open: boolean;
      onClose: () => void;
      mode: ModalMode;
      entity?: Project;
      onSubmit: (data: ProjectCreateInput | ProjectUpsertInput) => Promise<void>;
    }
  | {
      type: 'skill';
      open: boolean;
      onClose: () => void;
      mode: ModalMode;
      entity?: Skill;
      onSubmit: (data: SkillCreateInput | SkillUpsertInput) => Promise<void>;
    };

export type UpdateInputMap = {
  company: CompanyUpsertInput;
  education: EducationUpsertInput;
  project: ProjectUpsertInput;
  skill: SkillUpsertInput;
};

export type FormRelationType =
  | CompanyFormData
  | EducationFormData
  | ProjectFormData
  | SkillFormData;

export type CompanyListItemEntity = NonNullable<GetCompaniesQuery['companies']>[number];
export type EducationListItemEntity = NonNullable<GetEducationsQuery['educations']>[number];
export type ProjectListItemEntity = NonNullable<GetProjectsQuery['projects']>[number];
export type SkillListItemEntity = NonNullable<GetSkillsQuery['skills']>[number];

export type cvEntity = GetCvQuery['cv'];
export type CompanyEntity =
  | NonNullable<NonNullable<Required<GetCvQuery>['cv']>['companies']>[number]
  | CompanyUpsertInput
  | CompanyCreateInput;
export type EducationEntity =
  | NonNullable<NonNullable<Required<GetCvQuery>['cv']>['educations']>[number]
  | EducationUpsertInput
  | EducationCreateInput;
export type ProjectEntity =
  | NonNullable<NonNullable<Required<GetCvQuery>['cv']>['projects']>[number]
  | ProjectUpsertInput
  | ProjectCreateInput;
export type SkillEntity =
  | NonNullable<NonNullable<Required<GetCvQuery>['cv']>['skills']>[number]
  | SkillUpsertInput
  | SkillCreateInput;

// Helper types for CV relations that only need ID
export type CompanyRelationInput = Pick<CompanyUpsertInput, 'id'> &
  Partial<Omit<CompanyUpsertInput, 'id'>>;
export type EducationRelationInput = Pick<EducationUpsertInput, 'id'> &
  Partial<Omit<EducationUpsertInput, 'id'>>;
export type ProjectRelationInput = Pick<ProjectUpsertInput, 'id'> &
  Partial<Omit<ProjectUpsertInput, 'id'>>;
export type SkillRelationInput = Pick<SkillUpsertInput, 'id'> &
  Partial<Omit<SkillUpsertInput, 'id'>>;

export interface UseRelationCrudOptions {
  cvId?: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}
