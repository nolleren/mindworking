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
} from '../../graphql/generated/types';

export type RelationType = 'company' | 'education' | 'project' | 'skill';

export type RelationEntity =
  | NonNullable<NonNullable<Required<GetCvQuery>['cv']>['companies']>[number]
  | NonNullable<NonNullable<Required<GetCvQuery>['cv']>['educations']>[number]
  | NonNullable<NonNullable<Required<GetCvQuery>['cv']>['projects']>[number]
  | NonNullable<NonNullable<Required<GetCvQuery>['cv']>['skills']>[number];

export type CreateInputMap = {
  company: CompanyCreateInput;
  education: EducationCreateInput;
  project: ProjectCreateInput;
  skill: SkillCreateInput;
};

export type UpdateInputMap = {
  company: CompanyUpsertInput;
  education: EducationUpsertInput;
  project: ProjectUpsertInput;
  skill: SkillUpsertInput;
};

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
