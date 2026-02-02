import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client/react';
export type Maybe<T> = T | null | undefined;
export type InputMaybe<T> = T | null | undefined;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  Date: { input: string; output: string; }
  DateTime: { input: string; output: string; }
};

export type Company = {
  __typename?: 'Company';
  address?: Maybe<Scalars['String']['output']>;
  canDelete: Scalars['Boolean']['output'];
  city?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  cvs?: Maybe<Array<Cv>>;
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
  zipCode?: Maybe<Scalars['String']['output']>;
};

export type CompanyCreateInput = {
  address: Scalars['String']['input'];
  city: Scalars['String']['input'];
  description: Scalars['String']['input'];
  name: Scalars['String']['input'];
  zipCode: Scalars['String']['input'];
};

export type CompanyUpsertInput = {
  address: Scalars['String']['input'];
  city: Scalars['String']['input'];
  description: Scalars['String']['input'];
  id: Scalars['ID']['input'];
  name: Scalars['String']['input'];
  zipCode: Scalars['String']['input'];
};

export type CreateCvInput = {
  companies?: InputMaybe<Array<Scalars['ID']['input']>>;
  educations?: InputMaybe<Array<Scalars['ID']['input']>>;
  name: Scalars['String']['input'];
  projects?: InputMaybe<Array<Scalars['ID']['input']>>;
  skills?: InputMaybe<Array<Scalars['ID']['input']>>;
};

export type Cv = {
  __typename?: 'Cv';
  companies?: Maybe<Array<Company>>;
  createdAt: Scalars['DateTime']['output'];
  educations?: Maybe<Array<Education>>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  projects?: Maybe<Array<Project>>;
  skills?: Maybe<Array<Skill>>;
  updatedAt: Scalars['DateTime']['output'];
};

export type Education = {
  __typename?: 'Education';
  address?: Maybe<Scalars['String']['output']>;
  canDelete: Scalars['Boolean']['output'];
  city?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  cvs?: Maybe<Array<Cv>>;
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
  zipCode?: Maybe<Scalars['String']['output']>;
};

export type EducationCreateInput = {
  address: Scalars['String']['input'];
  city: Scalars['String']['input'];
  description: Scalars['String']['input'];
  name: Scalars['String']['input'];
  zipCode: Scalars['String']['input'];
};

export type EducationUpsertInput = {
  address: Scalars['String']['input'];
  city: Scalars['String']['input'];
  description: Scalars['String']['input'];
  id: Scalars['ID']['input'];
  name: Scalars['String']['input'];
  zipCode: Scalars['String']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createCompany: Company;
  createCv: Cv;
  createEducation: Education;
  createProject: Project;
  createSkill: Skill;
  deleteCompany: Scalars['Boolean']['output'];
  deleteCv: Scalars['Boolean']['output'];
  deleteEducation: Scalars['Boolean']['output'];
  deleteProject: Scalars['Boolean']['output'];
  deleteSkill: Scalars['Boolean']['output'];
  updateCompany: Company;
  updateCv: Cv;
  updateEducation: Education;
  updateProject: Project;
  updateSkill: Skill;
};

export type MutationCreateCompanyArgs = {
  input: CompanyCreateInput;
};

export type MutationCreateCvArgs = {
  input: CreateCvInput;
};

export type MutationCreateEducationArgs = {
  input: EducationCreateInput;
};

export type MutationCreateProjectArgs = {
  input: ProjectCreateInput;
};

export type MutationCreateSkillArgs = {
  input: SkillCreateInput;
};

export type MutationDeleteCompanyArgs = {
  id: Scalars['ID']['input'];
};

export type MutationDeleteCvArgs = {
  id: Scalars['ID']['input'];
};

export type MutationDeleteEducationArgs = {
  id: Scalars['ID']['input'];
};

export type MutationDeleteProjectArgs = {
  id: Scalars['ID']['input'];
};

export type MutationDeleteSkillArgs = {
  id: Scalars['ID']['input'];
};

export type MutationUpdateCompanyArgs = {
  input: CompanyUpsertInput;
};

export type MutationUpdateCvArgs = {
  input: UpdateCvInput;
};

export type MutationUpdateEducationArgs = {
  input: EducationUpsertInput;
};

export type MutationUpdateProjectArgs = {
  input: ProjectUpsertInput;
};

export type MutationUpdateSkillArgs = {
  input: SkillUpsertInput;
};

export type Project = {
  __typename?: 'Project';
  canDelete: Scalars['Boolean']['output'];
  createdAt: Scalars['DateTime']['output'];
  cvs?: Maybe<Array<Cv>>;
  description?: Maybe<Scalars['String']['output']>;
  endDate?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  startDate?: Maybe<Scalars['DateTime']['output']>;
  updatedAt: Scalars['DateTime']['output'];
};

export type ProjectCreateInput = {
  description: Scalars['String']['input'];
  endDate: Scalars['Date']['input'];
  name: Scalars['String']['input'];
  startDate: Scalars['Date']['input'];
};

export type ProjectUpsertInput = {
  description: Scalars['String']['input'];
  endDate: Scalars['Date']['input'];
  id: Scalars['ID']['input'];
  name: Scalars['String']['input'];
  startDate: Scalars['Date']['input'];
};

export type Query = {
  __typename?: 'Query';
  companies?: Maybe<Array<Company>>;
  company?: Maybe<Company>;
  cv?: Maybe<Cv>;
  cvs?: Maybe<Array<Cv>>;
  education?: Maybe<Education>;
  educations?: Maybe<Array<Education>>;
  project?: Maybe<Project>;
  projects?: Maybe<Array<Project>>;
  skill?: Maybe<Skill>;
  skills?: Maybe<Array<Skill>>;
};

export type QueryCompanyArgs = {
  id: Scalars['ID']['input'];
};

export type QueryCvArgs = {
  id: Scalars['ID']['input'];
};

export type QueryEducationArgs = {
  id: Scalars['ID']['input'];
};

export type QueryProjectArgs = {
  id: Scalars['ID']['input'];
};

export type QuerySkillArgs = {
  id: Scalars['ID']['input'];
};

export type Skill = {
  __typename?: 'Skill';
  canDelete: Scalars['Boolean']['output'];
  createdAt: Scalars['DateTime']['output'];
  cvs?: Maybe<Array<Cv>>;
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  levelOfMastery: SkillMasteryLevel;
  name: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type SkillCreateInput = {
  description: Scalars['String']['input'];
  levelOfMastery: SkillMasteryLevel;
  name: Scalars['String']['input'];
};

export type SkillMasteryLevel =
  | 'BASIS'
  | 'EVANGELIST'
  | 'MEDIUM'
  | 'STRONG';

export type SkillUpsertInput = {
  description: Scalars['String']['input'];
  id: Scalars['ID']['input'];
  levelOfMastery: SkillMasteryLevel;
  name: Scalars['String']['input'];
};

export type UpdateCvInput = {
  companies?: InputMaybe<Array<Scalars['ID']['input']>>;
  educations?: InputMaybe<Array<Scalars['ID']['input']>>;
  id: Scalars['ID']['input'];
  name: Scalars['String']['input'];
  projects?: InputMaybe<Array<Scalars['ID']['input']>>;
  skills?: InputMaybe<Array<Scalars['ID']['input']>>;
};

export type GetCompaniesQueryVariables = Exact<{ [key: string]: never; }>;

export type GetCompaniesQuery = { __typename?: 'Query', companies?: Array<{ __typename?: 'Company', id: string, name: string, address?: string | null | undefined, zipCode?: string | null | undefined, city?: string | null | undefined, description?: string | null | undefined, canDelete: boolean }> | null | undefined };

export type GetCompanyQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;

export type GetCompanyQuery = { __typename?: 'Query', company?: { __typename?: 'Company', id: string, name: string, address?: string | null | undefined, zipCode?: string | null | undefined, city?: string | null | undefined, description?: string | null | undefined, canDelete: boolean } | null | undefined };

export type CreateCompanyMutationVariables = Exact<{
  input: CompanyCreateInput;
}>;

export type CreateCompanyMutation = { __typename?: 'Mutation', createCompany: { __typename?: 'Company', id: string, name: string, address?: string | null | undefined, zipCode?: string | null | undefined, city?: string | null | undefined, description?: string | null | undefined, canDelete: boolean } };

export type UpdateCompanyMutationVariables = Exact<{
  input: CompanyUpsertInput;
}>;

export type UpdateCompanyMutation = { __typename?: 'Mutation', updateCompany: { __typename?: 'Company', id: string, name: string, address?: string | null | undefined, zipCode?: string | null | undefined, city?: string | null | undefined, description?: string | null | undefined, canDelete: boolean } };

export type DeleteCompanyMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;

export type DeleteCompanyMutation = { __typename?: 'Mutation', deleteCompany: boolean };

export type GetCvsQueryVariables = Exact<{ [key: string]: never; }>;

export type GetCvsQuery = { __typename?: 'Query', cvs?: Array<{ __typename?: 'Cv', id: string, name: string, createdAt: string, updatedAt: string, companies?: Array<{ __typename?: 'Company', id: string, name: string }> | null | undefined, projects?: Array<{ __typename?: 'Project', id: string, name: string }> | null | undefined, educations?: Array<{ __typename?: 'Education', id: string, name: string }> | null | undefined, skills?: Array<{ __typename?: 'Skill', id: string, name: string }> | null | undefined }> | null | undefined };

export type GetCvQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;

export type GetCvQuery = { __typename?: 'Query', cv?: { __typename?: 'Cv', id: string, name: string, createdAt: string, updatedAt: string, companies?: Array<{ __typename?: 'Company', id: string, name: string, address?: string | null | undefined, zipCode?: string | null | undefined, city?: string | null | undefined, description?: string | null | undefined }> | null | undefined, projects?: Array<{ __typename?: 'Project', id: string, name: string, startDate?: string | null | undefined, endDate?: string | null | undefined, description?: string | null | undefined }> | null | undefined, educations?: Array<{ __typename?: 'Education', id: string, name: string, address?: string | null | undefined, zipCode?: string | null | undefined, city?: string | null | undefined, description?: string | null | undefined }> | null | undefined, skills?: Array<{ __typename?: 'Skill', id: string, name: string, description?: string | null | undefined, levelOfMastery: SkillMasteryLevel }> | null | undefined } | null | undefined };

export type CreateCvMutationVariables = Exact<{
  input: CreateCvInput;
}>;

export type CreateCvMutation = { __typename?: 'Mutation', createCv: { __typename?: 'Cv', id: string, name: string, createdAt: string, updatedAt: string } };

export type UpdateCvMutationVariables = Exact<{
  input: UpdateCvInput;
}>;

export type UpdateCvMutation = { __typename?: 'Mutation', updateCv: { __typename?: 'Cv', id: string, name: string, updatedAt: string } };

export type DeleteCvMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;

export type DeleteCvMutation = { __typename?: 'Mutation', deleteCv: boolean };

export type GetEducationsQueryVariables = Exact<{ [key: string]: never; }>;

export type GetEducationsQuery = { __typename?: 'Query', educations?: Array<{ __typename?: 'Education', id: string, name: string, address?: string | null | undefined, zipCode?: string | null | undefined, city?: string | null | undefined, description?: string | null | undefined, canDelete: boolean }> | null | undefined };

export type GetEducationQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;

export type GetEducationQuery = { __typename?: 'Query', education?: { __typename?: 'Education', id: string, name: string, address?: string | null | undefined, zipCode?: string | null | undefined, city?: string | null | undefined, description?: string | null | undefined, canDelete: boolean } | null | undefined };

export type CreateEducationMutationVariables = Exact<{
  input: EducationCreateInput;
}>;

export type CreateEducationMutation = { __typename?: 'Mutation', createEducation: { __typename?: 'Education', id: string, name: string, address?: string | null | undefined, zipCode?: string | null | undefined, city?: string | null | undefined, description?: string | null | undefined, canDelete: boolean } };

export type UpdateEducationMutationVariables = Exact<{
  input: EducationUpsertInput;
}>;

export type UpdateEducationMutation = { __typename?: 'Mutation', updateEducation: { __typename?: 'Education', id: string, name: string, address?: string | null | undefined, zipCode?: string | null | undefined, city?: string | null | undefined, description?: string | null | undefined, canDelete: boolean } };

export type DeleteEducationMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;

export type DeleteEducationMutation = { __typename?: 'Mutation', deleteEducation: boolean };

export type GetProjectsQueryVariables = Exact<{ [key: string]: never; }>;

export type GetProjectsQuery = { __typename?: 'Query', projects?: Array<{ __typename?: 'Project', id: string, name: string, startDate?: string | null | undefined, endDate?: string | null | undefined, description?: string | null | undefined, canDelete: boolean }> | null | undefined };

export type GetProjectQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;

export type GetProjectQuery = { __typename?: 'Query', project?: { __typename?: 'Project', id: string, name: string, startDate?: string | null | undefined, endDate?: string | null | undefined, description?: string | null | undefined, canDelete: boolean } | null | undefined };

export type CreateProjectMutationVariables = Exact<{
  input: ProjectCreateInput;
}>;

export type CreateProjectMutation = { __typename?: 'Mutation', createProject: { __typename?: 'Project', id: string, name: string, startDate?: string | null | undefined, endDate?: string | null | undefined, description?: string | null | undefined, canDelete: boolean } };

export type UpdateProjectMutationVariables = Exact<{
  input: ProjectUpsertInput;
}>;

export type UpdateProjectMutation = { __typename?: 'Mutation', updateProject: { __typename?: 'Project', id: string, name: string, startDate?: string | null | undefined, endDate?: string | null | undefined, description?: string | null | undefined, canDelete: boolean } };

export type DeleteProjectMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;

export type DeleteProjectMutation = { __typename?: 'Mutation', deleteProject: boolean };

export type GetSkillsQueryVariables = Exact<{ [key: string]: never; }>;

export type GetSkillsQuery = { __typename?: 'Query', skills?: Array<{ __typename?: 'Skill', id: string, name: string, description?: string | null | undefined, levelOfMastery: SkillMasteryLevel, canDelete: boolean }> | null | undefined };

export type GetSkillQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;

export type GetSkillQuery = { __typename?: 'Query', skill?: { __typename?: 'Skill', id: string, name: string, description?: string | null | undefined, levelOfMastery: SkillMasteryLevel, canDelete: boolean } | null | undefined };

export type CreateSkillMutationVariables = Exact<{
  input: SkillCreateInput;
}>;

export type CreateSkillMutation = { __typename?: 'Mutation', createSkill: { __typename?: 'Skill', id: string, name: string, description?: string | null | undefined, levelOfMastery: SkillMasteryLevel, canDelete: boolean } };

export type UpdateSkillMutationVariables = Exact<{
  input: SkillUpsertInput;
}>;

export type UpdateSkillMutation = { __typename?: 'Mutation', updateSkill: { __typename?: 'Skill', id: string, name: string, description?: string | null | undefined, levelOfMastery: SkillMasteryLevel, canDelete: boolean } };

export type DeleteSkillMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;

export type DeleteSkillMutation = { __typename?: 'Mutation', deleteSkill: boolean };

export const GetCompaniesDocument = gql`
    query GetCompanies {
  companies {
    id
    name
    address
    zipCode
    city
    description
    canDelete
  }
}
    `;

/**
 * __useGetCompaniesQuery__
 *
 * To run a query within a React component, call `useGetCompaniesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCompaniesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCompaniesQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetCompaniesQuery(baseOptions?: Apollo.useQuery.Options<GetCompaniesQuery, GetCompaniesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCompaniesQuery, GetCompaniesQueryVariables>(GetCompaniesDocument, options);
      }
export function useGetCompaniesLazyQuery(baseOptions?: Apollo.useLazyQuery.Options<GetCompaniesQuery, GetCompaniesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCompaniesQuery, GetCompaniesQueryVariables>(GetCompaniesDocument, options);
        }
export function useGetCompaniesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.useSuspenseQuery.Options<GetCompaniesQueryVariables>) {
          const options: Apollo.SkipToken | Apollo.useSuspenseQuery.Options<GetCompaniesQueryVariables> = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...(baseOptions ?? {})}
          return Apollo.useSuspenseQuery<GetCompaniesQuery, GetCompaniesQueryVariables>(GetCompaniesDocument, options);
        }
export type GetCompaniesQueryHookResult = ReturnType<typeof useGetCompaniesQuery>;
export type GetCompaniesLazyQueryHookResult = ReturnType<typeof useGetCompaniesLazyQuery>;
export type GetCompaniesSuspenseQueryHookResult = ReturnType<typeof useGetCompaniesSuspenseQuery>;
export type GetCompaniesQueryResult = Apollo.useQuery.Result<GetCompaniesQuery, GetCompaniesQueryVariables>;
export const GetCompanyDocument = gql`
    query GetCompany($id: ID!) {
  company(id: $id) {
    id
    name
    address
    zipCode
    city
    description
    canDelete
  }
}
    `;

/**
 * __useGetCompanyQuery__
 *
 * To run a query within a React component, call `useGetCompanyQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCompanyQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCompanyQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetCompanyQuery(baseOptions: Apollo.useQuery.Options<GetCompanyQuery, GetCompanyQueryVariables> & ({ variables: GetCompanyQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCompanyQuery, GetCompanyQueryVariables>(GetCompanyDocument, options);
      }
export function useGetCompanyLazyQuery(baseOptions?: Apollo.useLazyQuery.Options<GetCompanyQuery, GetCompanyQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCompanyQuery, GetCompanyQueryVariables>(GetCompanyDocument, options);
        }
export function useGetCompanySuspenseQuery(baseOptions: Apollo.SkipToken | Apollo.useSuspenseQuery.Options<GetCompanyQueryVariables>) {
          const options: Apollo.SkipToken | Apollo.useSuspenseQuery.Options<GetCompanyQueryVariables> = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetCompanyQuery, GetCompanyQueryVariables>(GetCompanyDocument, options);
        }
export type GetCompanyQueryHookResult = ReturnType<typeof useGetCompanyQuery>;
export type GetCompanyLazyQueryHookResult = ReturnType<typeof useGetCompanyLazyQuery>;
export type GetCompanySuspenseQueryHookResult = ReturnType<typeof useGetCompanySuspenseQuery>;
export type GetCompanyQueryResult = Apollo.useQuery.Result<GetCompanyQuery, GetCompanyQueryVariables>;
export const CreateCompanyDocument = gql`
    mutation CreateCompany($input: CompanyCreateInput!) {
  createCompany(input: $input) {
    id
    name
    address
    zipCode
    city
    description
    canDelete
  }
}
    `;
export type CreateCompanyMutationFn = Apollo.useMutation.MutationFunction<CreateCompanyMutation, CreateCompanyMutationVariables>;

/**
 * __useCreateCompanyMutation__
 *
 * To run a mutation, you first call `useCreateCompanyMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateCompanyMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createCompanyMutation, { data, loading, error }] = useCreateCompanyMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateCompanyMutation(baseOptions?: Apollo.useMutation.Options<CreateCompanyMutation, CreateCompanyMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateCompanyMutation, CreateCompanyMutationVariables>(CreateCompanyDocument, options);
      }
export type CreateCompanyMutationHookResult = ReturnType<typeof useCreateCompanyMutation>;
export type CreateCompanyMutationResult = Apollo.useMutation.Result<CreateCompanyMutation>;
export type CreateCompanyMutationOptions = Apollo.useMutation.Options<CreateCompanyMutation, CreateCompanyMutationVariables>;
export const UpdateCompanyDocument = gql`
    mutation UpdateCompany($input: CompanyUpsertInput!) {
  updateCompany(input: $input) {
    id
    name
    address
    zipCode
    city
    description
    canDelete
  }
}
    `;
export type UpdateCompanyMutationFn = Apollo.useMutation.MutationFunction<UpdateCompanyMutation, UpdateCompanyMutationVariables>;

/**
 * __useUpdateCompanyMutation__
 *
 * To run a mutation, you first call `useUpdateCompanyMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateCompanyMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateCompanyMutation, { data, loading, error }] = useUpdateCompanyMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateCompanyMutation(baseOptions?: Apollo.useMutation.Options<UpdateCompanyMutation, UpdateCompanyMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateCompanyMutation, UpdateCompanyMutationVariables>(UpdateCompanyDocument, options);
      }
export type UpdateCompanyMutationHookResult = ReturnType<typeof useUpdateCompanyMutation>;
export type UpdateCompanyMutationResult = Apollo.useMutation.Result<UpdateCompanyMutation>;
export type UpdateCompanyMutationOptions = Apollo.useMutation.Options<UpdateCompanyMutation, UpdateCompanyMutationVariables>;
export const DeleteCompanyDocument = gql`
    mutation DeleteCompany($id: ID!) {
  deleteCompany(id: $id)
}
    `;
export type DeleteCompanyMutationFn = Apollo.useMutation.MutationFunction<DeleteCompanyMutation, DeleteCompanyMutationVariables>;

/**
 * __useDeleteCompanyMutation__
 *
 * To run a mutation, you first call `useDeleteCompanyMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteCompanyMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteCompanyMutation, { data, loading, error }] = useDeleteCompanyMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteCompanyMutation(baseOptions?: Apollo.useMutation.Options<DeleteCompanyMutation, DeleteCompanyMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteCompanyMutation, DeleteCompanyMutationVariables>(DeleteCompanyDocument, options);
      }
export type DeleteCompanyMutationHookResult = ReturnType<typeof useDeleteCompanyMutation>;
export type DeleteCompanyMutationResult = Apollo.useMutation.Result<DeleteCompanyMutation>;
export type DeleteCompanyMutationOptions = Apollo.useMutation.Options<DeleteCompanyMutation, DeleteCompanyMutationVariables>;
export const GetCvsDocument = gql`
    query GetCvs {
  cvs {
    id
    name
    createdAt
    updatedAt
    companies {
      id
      name
    }
    projects {
      id
      name
    }
    educations {
      id
      name
    }
    skills {
      id
      name
    }
  }
}
    `;

/**
 * __useGetCvsQuery__
 *
 * To run a query within a React component, call `useGetCvsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCvsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCvsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetCvsQuery(baseOptions?: Apollo.useQuery.Options<GetCvsQuery, GetCvsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCvsQuery, GetCvsQueryVariables>(GetCvsDocument, options);
      }
export function useGetCvsLazyQuery(baseOptions?: Apollo.useLazyQuery.Options<GetCvsQuery, GetCvsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCvsQuery, GetCvsQueryVariables>(GetCvsDocument, options);
        }
export function useGetCvsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.useSuspenseQuery.Options<GetCvsQueryVariables>) {
          const options: Apollo.SkipToken | Apollo.useSuspenseQuery.Options<GetCvsQueryVariables> = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...(baseOptions ?? {})}
          return Apollo.useSuspenseQuery<GetCvsQuery, GetCvsQueryVariables>(GetCvsDocument, options);
        }
export type GetCvsQueryHookResult = ReturnType<typeof useGetCvsQuery>;
export type GetCvsLazyQueryHookResult = ReturnType<typeof useGetCvsLazyQuery>;
export type GetCvsSuspenseQueryHookResult = ReturnType<typeof useGetCvsSuspenseQuery>;
export type GetCvsQueryResult = Apollo.useQuery.Result<GetCvsQuery, GetCvsQueryVariables>;
export const GetCvDocument = gql`
    query GetCv($id: ID!) {
  cv(id: $id) {
    id
    name
    createdAt
    updatedAt
    companies {
      id
      name
      address
      zipCode
      city
      description
    }
    projects {
      id
      name
      startDate
      endDate
      description
    }
    educations {
      id
      name
      address
      zipCode
      city
      description
    }
    skills {
      id
      name
      description
      levelOfMastery
    }
  }
}
    `;

/**
 * __useGetCvQuery__
 *
 * To run a query within a React component, call `useGetCvQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCvQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCvQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetCvQuery(baseOptions: Apollo.useQuery.Options<GetCvQuery, GetCvQueryVariables> & ({ variables: GetCvQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCvQuery, GetCvQueryVariables>(GetCvDocument, options);
      }
export function useGetCvLazyQuery(baseOptions?: Apollo.useLazyQuery.Options<GetCvQuery, GetCvQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCvQuery, GetCvQueryVariables>(GetCvDocument, options);
        }
export function useGetCvSuspenseQuery(baseOptions: Apollo.SkipToken | Apollo.useSuspenseQuery.Options<GetCvQueryVariables>) {
          const options: Apollo.SkipToken | Apollo.useSuspenseQuery.Options<GetCvQueryVariables> = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetCvQuery, GetCvQueryVariables>(GetCvDocument, options);
        }
export type GetCvQueryHookResult = ReturnType<typeof useGetCvQuery>;
export type GetCvLazyQueryHookResult = ReturnType<typeof useGetCvLazyQuery>;
export type GetCvSuspenseQueryHookResult = ReturnType<typeof useGetCvSuspenseQuery>;
export type GetCvQueryResult = Apollo.useQuery.Result<GetCvQuery, GetCvQueryVariables>;
export const CreateCvDocument = gql`
    mutation CreateCv($input: CreateCvInput!) {
  createCv(input: $input) {
    id
    name
    createdAt
    updatedAt
  }
}
    `;
export type CreateCvMutationFn = Apollo.useMutation.MutationFunction<CreateCvMutation, CreateCvMutationVariables>;

/**
 * __useCreateCvMutation__
 *
 * To run a mutation, you first call `useCreateCvMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateCvMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createCvMutation, { data, loading, error }] = useCreateCvMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateCvMutation(baseOptions?: Apollo.useMutation.Options<CreateCvMutation, CreateCvMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateCvMutation, CreateCvMutationVariables>(CreateCvDocument, options);
      }
export type CreateCvMutationHookResult = ReturnType<typeof useCreateCvMutation>;
export type CreateCvMutationResult = Apollo.useMutation.Result<CreateCvMutation>;
export type CreateCvMutationOptions = Apollo.useMutation.Options<CreateCvMutation, CreateCvMutationVariables>;
export const UpdateCvDocument = gql`
    mutation UpdateCv($input: UpdateCvInput!) {
  updateCv(input: $input) {
    id
    name
    updatedAt
  }
}
    `;
export type UpdateCvMutationFn = Apollo.useMutation.MutationFunction<UpdateCvMutation, UpdateCvMutationVariables>;

/**
 * __useUpdateCvMutation__
 *
 * To run a mutation, you first call `useUpdateCvMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateCvMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateCvMutation, { data, loading, error }] = useUpdateCvMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateCvMutation(baseOptions?: Apollo.useMutation.Options<UpdateCvMutation, UpdateCvMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateCvMutation, UpdateCvMutationVariables>(UpdateCvDocument, options);
      }
export type UpdateCvMutationHookResult = ReturnType<typeof useUpdateCvMutation>;
export type UpdateCvMutationResult = Apollo.useMutation.Result<UpdateCvMutation>;
export type UpdateCvMutationOptions = Apollo.useMutation.Options<UpdateCvMutation, UpdateCvMutationVariables>;
export const DeleteCvDocument = gql`
    mutation DeleteCv($id: ID!) {
  deleteCv(id: $id)
}
    `;
export type DeleteCvMutationFn = Apollo.useMutation.MutationFunction<DeleteCvMutation, DeleteCvMutationVariables>;

/**
 * __useDeleteCvMutation__
 *
 * To run a mutation, you first call `useDeleteCvMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteCvMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteCvMutation, { data, loading, error }] = useDeleteCvMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteCvMutation(baseOptions?: Apollo.useMutation.Options<DeleteCvMutation, DeleteCvMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteCvMutation, DeleteCvMutationVariables>(DeleteCvDocument, options);
      }
export type DeleteCvMutationHookResult = ReturnType<typeof useDeleteCvMutation>;
export type DeleteCvMutationResult = Apollo.useMutation.Result<DeleteCvMutation>;
export type DeleteCvMutationOptions = Apollo.useMutation.Options<DeleteCvMutation, DeleteCvMutationVariables>;
export const GetEducationsDocument = gql`
    query GetEducations {
  educations {
    id
    name
    address
    zipCode
    city
    description
    canDelete
  }
}
    `;

/**
 * __useGetEducationsQuery__
 *
 * To run a query within a React component, call `useGetEducationsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetEducationsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetEducationsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetEducationsQuery(baseOptions?: Apollo.useQuery.Options<GetEducationsQuery, GetEducationsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetEducationsQuery, GetEducationsQueryVariables>(GetEducationsDocument, options);
      }
export function useGetEducationsLazyQuery(baseOptions?: Apollo.useLazyQuery.Options<GetEducationsQuery, GetEducationsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetEducationsQuery, GetEducationsQueryVariables>(GetEducationsDocument, options);
        }
export function useGetEducationsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.useSuspenseQuery.Options<GetEducationsQueryVariables>) {
          const options: Apollo.SkipToken | Apollo.useSuspenseQuery.Options<GetEducationsQueryVariables> = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...(baseOptions ?? {})}
          return Apollo.useSuspenseQuery<GetEducationsQuery, GetEducationsQueryVariables>(GetEducationsDocument, options);
        }
export type GetEducationsQueryHookResult = ReturnType<typeof useGetEducationsQuery>;
export type GetEducationsLazyQueryHookResult = ReturnType<typeof useGetEducationsLazyQuery>;
export type GetEducationsSuspenseQueryHookResult = ReturnType<typeof useGetEducationsSuspenseQuery>;
export type GetEducationsQueryResult = Apollo.useQuery.Result<GetEducationsQuery, GetEducationsQueryVariables>;
export const GetEducationDocument = gql`
    query GetEducation($id: ID!) {
  education(id: $id) {
    id
    name
    address
    zipCode
    city
    description
    canDelete
  }
}
    `;

/**
 * __useGetEducationQuery__
 *
 * To run a query within a React component, call `useGetEducationQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetEducationQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetEducationQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetEducationQuery(baseOptions: Apollo.useQuery.Options<GetEducationQuery, GetEducationQueryVariables> & ({ variables: GetEducationQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetEducationQuery, GetEducationQueryVariables>(GetEducationDocument, options);
      }
export function useGetEducationLazyQuery(baseOptions?: Apollo.useLazyQuery.Options<GetEducationQuery, GetEducationQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetEducationQuery, GetEducationQueryVariables>(GetEducationDocument, options);
        }
export function useGetEducationSuspenseQuery(baseOptions: Apollo.SkipToken | Apollo.useSuspenseQuery.Options<GetEducationQueryVariables>) {
          const options: Apollo.SkipToken | Apollo.useSuspenseQuery.Options<GetEducationQueryVariables> = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetEducationQuery, GetEducationQueryVariables>(GetEducationDocument, options);
        }
export type GetEducationQueryHookResult = ReturnType<typeof useGetEducationQuery>;
export type GetEducationLazyQueryHookResult = ReturnType<typeof useGetEducationLazyQuery>;
export type GetEducationSuspenseQueryHookResult = ReturnType<typeof useGetEducationSuspenseQuery>;
export type GetEducationQueryResult = Apollo.useQuery.Result<GetEducationQuery, GetEducationQueryVariables>;
export const CreateEducationDocument = gql`
    mutation CreateEducation($input: EducationCreateInput!) {
  createEducation(input: $input) {
    id
    name
    address
    zipCode
    city
    description
    canDelete
  }
}
    `;
export type CreateEducationMutationFn = Apollo.useMutation.MutationFunction<CreateEducationMutation, CreateEducationMutationVariables>;

/**
 * __useCreateEducationMutation__
 *
 * To run a mutation, you first call `useCreateEducationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateEducationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createEducationMutation, { data, loading, error }] = useCreateEducationMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateEducationMutation(baseOptions?: Apollo.useMutation.Options<CreateEducationMutation, CreateEducationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateEducationMutation, CreateEducationMutationVariables>(CreateEducationDocument, options);
      }
export type CreateEducationMutationHookResult = ReturnType<typeof useCreateEducationMutation>;
export type CreateEducationMutationResult = Apollo.useMutation.Result<CreateEducationMutation>;
export type CreateEducationMutationOptions = Apollo.useMutation.Options<CreateEducationMutation, CreateEducationMutationVariables>;
export const UpdateEducationDocument = gql`
    mutation UpdateEducation($input: EducationUpsertInput!) {
  updateEducation(input: $input) {
    id
    name
    address
    zipCode
    city
    description
    canDelete
  }
}
    `;
export type UpdateEducationMutationFn = Apollo.useMutation.MutationFunction<UpdateEducationMutation, UpdateEducationMutationVariables>;

/**
 * __useUpdateEducationMutation__
 *
 * To run a mutation, you first call `useUpdateEducationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateEducationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateEducationMutation, { data, loading, error }] = useUpdateEducationMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateEducationMutation(baseOptions?: Apollo.useMutation.Options<UpdateEducationMutation, UpdateEducationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateEducationMutation, UpdateEducationMutationVariables>(UpdateEducationDocument, options);
      }
export type UpdateEducationMutationHookResult = ReturnType<typeof useUpdateEducationMutation>;
export type UpdateEducationMutationResult = Apollo.useMutation.Result<UpdateEducationMutation>;
export type UpdateEducationMutationOptions = Apollo.useMutation.Options<UpdateEducationMutation, UpdateEducationMutationVariables>;
export const DeleteEducationDocument = gql`
    mutation DeleteEducation($id: ID!) {
  deleteEducation(id: $id)
}
    `;
export type DeleteEducationMutationFn = Apollo.useMutation.MutationFunction<DeleteEducationMutation, DeleteEducationMutationVariables>;

/**
 * __useDeleteEducationMutation__
 *
 * To run a mutation, you first call `useDeleteEducationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteEducationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteEducationMutation, { data, loading, error }] = useDeleteEducationMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteEducationMutation(baseOptions?: Apollo.useMutation.Options<DeleteEducationMutation, DeleteEducationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteEducationMutation, DeleteEducationMutationVariables>(DeleteEducationDocument, options);
      }
export type DeleteEducationMutationHookResult = ReturnType<typeof useDeleteEducationMutation>;
export type DeleteEducationMutationResult = Apollo.useMutation.Result<DeleteEducationMutation>;
export type DeleteEducationMutationOptions = Apollo.useMutation.Options<DeleteEducationMutation, DeleteEducationMutationVariables>;
export const GetProjectsDocument = gql`
    query GetProjects {
  projects {
    id
    name
    startDate
    endDate
    description
    canDelete
  }
}
    `;

/**
 * __useGetProjectsQuery__
 *
 * To run a query within a React component, call `useGetProjectsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetProjectsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetProjectsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetProjectsQuery(baseOptions?: Apollo.useQuery.Options<GetProjectsQuery, GetProjectsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetProjectsQuery, GetProjectsQueryVariables>(GetProjectsDocument, options);
      }
export function useGetProjectsLazyQuery(baseOptions?: Apollo.useLazyQuery.Options<GetProjectsQuery, GetProjectsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetProjectsQuery, GetProjectsQueryVariables>(GetProjectsDocument, options);
        }
export function useGetProjectsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.useSuspenseQuery.Options<GetProjectsQueryVariables>) {
          const options: Apollo.SkipToken | Apollo.useSuspenseQuery.Options<GetProjectsQueryVariables> = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...(baseOptions ?? {})}
          return Apollo.useSuspenseQuery<GetProjectsQuery, GetProjectsQueryVariables>(GetProjectsDocument, options);
        }
export type GetProjectsQueryHookResult = ReturnType<typeof useGetProjectsQuery>;
export type GetProjectsLazyQueryHookResult = ReturnType<typeof useGetProjectsLazyQuery>;
export type GetProjectsSuspenseQueryHookResult = ReturnType<typeof useGetProjectsSuspenseQuery>;
export type GetProjectsQueryResult = Apollo.useQuery.Result<GetProjectsQuery, GetProjectsQueryVariables>;
export const GetProjectDocument = gql`
    query GetProject($id: ID!) {
  project(id: $id) {
    id
    name
    startDate
    endDate
    description
    canDelete
  }
}
    `;

/**
 * __useGetProjectQuery__
 *
 * To run a query within a React component, call `useGetProjectQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetProjectQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetProjectQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetProjectQuery(baseOptions: Apollo.useQuery.Options<GetProjectQuery, GetProjectQueryVariables> & ({ variables: GetProjectQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetProjectQuery, GetProjectQueryVariables>(GetProjectDocument, options);
      }
export function useGetProjectLazyQuery(baseOptions?: Apollo.useLazyQuery.Options<GetProjectQuery, GetProjectQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetProjectQuery, GetProjectQueryVariables>(GetProjectDocument, options);
        }
export function useGetProjectSuspenseQuery(baseOptions: Apollo.SkipToken | Apollo.useSuspenseQuery.Options<GetProjectQueryVariables>) {
          const options: Apollo.SkipToken | Apollo.useSuspenseQuery.Options<GetProjectQueryVariables> = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetProjectQuery, GetProjectQueryVariables>(GetProjectDocument, options);
        }
export type GetProjectQueryHookResult = ReturnType<typeof useGetProjectQuery>;
export type GetProjectLazyQueryHookResult = ReturnType<typeof useGetProjectLazyQuery>;
export type GetProjectSuspenseQueryHookResult = ReturnType<typeof useGetProjectSuspenseQuery>;
export type GetProjectQueryResult = Apollo.useQuery.Result<GetProjectQuery, GetProjectQueryVariables>;
export const CreateProjectDocument = gql`
    mutation CreateProject($input: ProjectCreateInput!) {
  createProject(input: $input) {
    id
    name
    startDate
    endDate
    description
    canDelete
  }
}
    `;
export type CreateProjectMutationFn = Apollo.useMutation.MutationFunction<CreateProjectMutation, CreateProjectMutationVariables>;

/**
 * __useCreateProjectMutation__
 *
 * To run a mutation, you first call `useCreateProjectMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateProjectMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createProjectMutation, { data, loading, error }] = useCreateProjectMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateProjectMutation(baseOptions?: Apollo.useMutation.Options<CreateProjectMutation, CreateProjectMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateProjectMutation, CreateProjectMutationVariables>(CreateProjectDocument, options);
      }
export type CreateProjectMutationHookResult = ReturnType<typeof useCreateProjectMutation>;
export type CreateProjectMutationResult = Apollo.useMutation.Result<CreateProjectMutation>;
export type CreateProjectMutationOptions = Apollo.useMutation.Options<CreateProjectMutation, CreateProjectMutationVariables>;
export const UpdateProjectDocument = gql`
    mutation UpdateProject($input: ProjectUpsertInput!) {
  updateProject(input: $input) {
    id
    name
    startDate
    endDate
    description
    canDelete
  }
}
    `;
export type UpdateProjectMutationFn = Apollo.useMutation.MutationFunction<UpdateProjectMutation, UpdateProjectMutationVariables>;

/**
 * __useUpdateProjectMutation__
 *
 * To run a mutation, you first call `useUpdateProjectMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateProjectMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateProjectMutation, { data, loading, error }] = useUpdateProjectMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateProjectMutation(baseOptions?: Apollo.useMutation.Options<UpdateProjectMutation, UpdateProjectMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateProjectMutation, UpdateProjectMutationVariables>(UpdateProjectDocument, options);
      }
export type UpdateProjectMutationHookResult = ReturnType<typeof useUpdateProjectMutation>;
export type UpdateProjectMutationResult = Apollo.useMutation.Result<UpdateProjectMutation>;
export type UpdateProjectMutationOptions = Apollo.useMutation.Options<UpdateProjectMutation, UpdateProjectMutationVariables>;
export const DeleteProjectDocument = gql`
    mutation DeleteProject($id: ID!) {
  deleteProject(id: $id)
}
    `;
export type DeleteProjectMutationFn = Apollo.useMutation.MutationFunction<DeleteProjectMutation, DeleteProjectMutationVariables>;

/**
 * __useDeleteProjectMutation__
 *
 * To run a mutation, you first call `useDeleteProjectMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteProjectMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteProjectMutation, { data, loading, error }] = useDeleteProjectMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteProjectMutation(baseOptions?: Apollo.useMutation.Options<DeleteProjectMutation, DeleteProjectMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteProjectMutation, DeleteProjectMutationVariables>(DeleteProjectDocument, options);
      }
export type DeleteProjectMutationHookResult = ReturnType<typeof useDeleteProjectMutation>;
export type DeleteProjectMutationResult = Apollo.useMutation.Result<DeleteProjectMutation>;
export type DeleteProjectMutationOptions = Apollo.useMutation.Options<DeleteProjectMutation, DeleteProjectMutationVariables>;
export const GetSkillsDocument = gql`
    query GetSkills {
  skills {
    id
    name
    description
    levelOfMastery
    canDelete
  }
}
    `;

/**
 * __useGetSkillsQuery__
 *
 * To run a query within a React component, call `useGetSkillsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetSkillsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetSkillsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetSkillsQuery(baseOptions?: Apollo.useQuery.Options<GetSkillsQuery, GetSkillsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetSkillsQuery, GetSkillsQueryVariables>(GetSkillsDocument, options);
      }
export function useGetSkillsLazyQuery(baseOptions?: Apollo.useLazyQuery.Options<GetSkillsQuery, GetSkillsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetSkillsQuery, GetSkillsQueryVariables>(GetSkillsDocument, options);
        }
export function useGetSkillsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.useSuspenseQuery.Options<GetSkillsQueryVariables>) {
          const options: Apollo.SkipToken | Apollo.useSuspenseQuery.Options<GetSkillsQueryVariables> = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...(baseOptions ?? {})}
          return Apollo.useSuspenseQuery<GetSkillsQuery, GetSkillsQueryVariables>(GetSkillsDocument, options);
        }
export type GetSkillsQueryHookResult = ReturnType<typeof useGetSkillsQuery>;
export type GetSkillsLazyQueryHookResult = ReturnType<typeof useGetSkillsLazyQuery>;
export type GetSkillsSuspenseQueryHookResult = ReturnType<typeof useGetSkillsSuspenseQuery>;
export type GetSkillsQueryResult = Apollo.useQuery.Result<GetSkillsQuery, GetSkillsQueryVariables>;
export const GetSkillDocument = gql`
    query GetSkill($id: ID!) {
  skill(id: $id) {
    id
    name
    description
    levelOfMastery
    canDelete
  }
}
    `;

/**
 * __useGetSkillQuery__
 *
 * To run a query within a React component, call `useGetSkillQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetSkillQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetSkillQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetSkillQuery(baseOptions: Apollo.useQuery.Options<GetSkillQuery, GetSkillQueryVariables> & ({ variables: GetSkillQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetSkillQuery, GetSkillQueryVariables>(GetSkillDocument, options);
      }
export function useGetSkillLazyQuery(baseOptions?: Apollo.useLazyQuery.Options<GetSkillQuery, GetSkillQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetSkillQuery, GetSkillQueryVariables>(GetSkillDocument, options);
        }
export function useGetSkillSuspenseQuery(baseOptions: Apollo.SkipToken | Apollo.useSuspenseQuery.Options<GetSkillQueryVariables>) {
          const options: Apollo.SkipToken | Apollo.useSuspenseQuery.Options<GetSkillQueryVariables> = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetSkillQuery, GetSkillQueryVariables>(GetSkillDocument, options);
        }
export type GetSkillQueryHookResult = ReturnType<typeof useGetSkillQuery>;
export type GetSkillLazyQueryHookResult = ReturnType<typeof useGetSkillLazyQuery>;
export type GetSkillSuspenseQueryHookResult = ReturnType<typeof useGetSkillSuspenseQuery>;
export type GetSkillQueryResult = Apollo.useQuery.Result<GetSkillQuery, GetSkillQueryVariables>;
export const CreateSkillDocument = gql`
    mutation CreateSkill($input: SkillCreateInput!) {
  createSkill(input: $input) {
    id
    name
    description
    levelOfMastery
    canDelete
  }
}
    `;
export type CreateSkillMutationFn = Apollo.useMutation.MutationFunction<CreateSkillMutation, CreateSkillMutationVariables>;

/**
 * __useCreateSkillMutation__
 *
 * To run a mutation, you first call `useCreateSkillMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateSkillMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createSkillMutation, { data, loading, error }] = useCreateSkillMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateSkillMutation(baseOptions?: Apollo.useMutation.Options<CreateSkillMutation, CreateSkillMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateSkillMutation, CreateSkillMutationVariables>(CreateSkillDocument, options);
      }
export type CreateSkillMutationHookResult = ReturnType<typeof useCreateSkillMutation>;
export type CreateSkillMutationResult = Apollo.useMutation.Result<CreateSkillMutation>;
export type CreateSkillMutationOptions = Apollo.useMutation.Options<CreateSkillMutation, CreateSkillMutationVariables>;
export const UpdateSkillDocument = gql`
    mutation UpdateSkill($input: SkillUpsertInput!) {
  updateSkill(input: $input) {
    id
    name
    description
    levelOfMastery
    canDelete
  }
}
    `;
export type UpdateSkillMutationFn = Apollo.useMutation.MutationFunction<UpdateSkillMutation, UpdateSkillMutationVariables>;

/**
 * __useUpdateSkillMutation__
 *
 * To run a mutation, you first call `useUpdateSkillMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateSkillMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateSkillMutation, { data, loading, error }] = useUpdateSkillMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateSkillMutation(baseOptions?: Apollo.useMutation.Options<UpdateSkillMutation, UpdateSkillMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateSkillMutation, UpdateSkillMutationVariables>(UpdateSkillDocument, options);
      }
export type UpdateSkillMutationHookResult = ReturnType<typeof useUpdateSkillMutation>;
export type UpdateSkillMutationResult = Apollo.useMutation.Result<UpdateSkillMutation>;
export type UpdateSkillMutationOptions = Apollo.useMutation.Options<UpdateSkillMutation, UpdateSkillMutationVariables>;
export const DeleteSkillDocument = gql`
    mutation DeleteSkill($id: ID!) {
  deleteSkill(id: $id)
}
    `;
export type DeleteSkillMutationFn = Apollo.useMutation.MutationFunction<DeleteSkillMutation, DeleteSkillMutationVariables>;

/**
 * __useDeleteSkillMutation__
 *
 * To run a mutation, you first call `useDeleteSkillMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteSkillMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteSkillMutation, { data, loading, error }] = useDeleteSkillMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteSkillMutation(baseOptions?: Apollo.useMutation.Options<DeleteSkillMutation, DeleteSkillMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteSkillMutation, DeleteSkillMutationVariables>(DeleteSkillDocument, options);
      }
export type DeleteSkillMutationHookResult = ReturnType<typeof useDeleteSkillMutation>;
export type DeleteSkillMutationResult = Apollo.useMutation.Result<DeleteSkillMutation>;
export type DeleteSkillMutationOptions = Apollo.useMutation.Options<DeleteSkillMutation, DeleteSkillMutationVariables>;