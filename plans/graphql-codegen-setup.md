# GraphQL Code Generator Setup

GraphQL Code Generator vil automatisk generere TypeScript typer og Apollo React hooks direkte fra dit GraphQL schema. Dette giver type-sikkerhed og reducerer boilerplate kode betydeligt.

## Fordele ved GraphQL Code Generator

- ✅ **Automatisk type-generering** - Typer genereres fra schema
- ✅ **Auto-genererede hooks** - `useQuery` og `useMutation` hooks genereres automatisk
- ✅ **Type-sikkerhed** - Fuld TypeScript support gennem hele stakken
- ✅ **Mindre boilerplate** - Ingen manuel definition af typer
- ✅ **Schema-synkronisering** - Typer opdateres automatisk når schema ændres
- ✅ **IntelliSense support** - Fuld autocomplete i IDE

## Installation

### Dependencies

Tilføj følgende til [`package.json`](../src/Mind.Client/package.json):

```json
{
	"devDependencies": {
		"@graphql-codegen/cli": "^5.0.0",
		"@graphql-codegen/typescript": "^4.0.1",
		"@graphql-codegen/typescript-operations": "^4.0.1",
		"@graphql-codegen/typescript-react-apollo": "^4.1.0",
		"@graphql-codegen/introspection": "^4.0.0"
	}
}
```

## Konfiguration

### codegen.ts

Opret [`codegen.ts`](../src/Mind.Client/codegen.ts) i projektets rod:

```typescript
import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
	// Schema URL - peger på din GraphQL API
	schema: 'http://localhost:8080/graphql',

	// Hvor dine GraphQL operations ligger (.graphql eller .ts/.tsx filer)
	documents: ['src/**/*.{ts,tsx}', 'src/graphql/**/*.graphql'],

	// Hvor de genererede filer skal placeres
	generates: {
		'./src/graphql/generated/types.ts': {
			plugins: [
				'typescript',
				'typescript-operations',
				'typescript-react-apollo',
			],
			config: {
				// Konfiguration
				withHooks: true, // Generer hooks
				withComponent: false, // Vi bruger ikke components
				withHOC: false, // Vi bruger ikke HOCs
				skipTypename: false,
				enumsAsTypes: true,
				// Apollo client import
				apolloClientVersion: 4,
				// Navngivning
				namingConvention: {
					typeNames: 'pascal-case#pascalCase',
					enumValues: 'upper-case#upperCase',
				},
				// Tilføj Maybe utility type
				maybeValue: 'T | null | undefined',
				// Gør alle felter optional som default
				avoidOptionals: {
					field: false,
					inputValue: false,
					object: false,
				},
			},
		},
		// Generer også introspection result til schema validering
		'./src/graphql/generated/introspection.json': {
			plugins: ['introspection'],
		},
	},
	// Ignorer schema errors under udvikling
	ignoreNoDocuments: true,
};

export default config;
```

## GraphQL Operations

### Organisering af Operations

Opret GraphQL operations i dedikerede filer:

#### src/graphql/operations/cv.graphql

```graphql
# Queries
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

# Mutations
mutation CreateCv($input: CvCreateInput!) {
	createCv(input: $input) {
		id
		name
		createdAt
		updatedAt
	}
}

mutation UpdateCv($input: CvUpdateInput!) {
	updateCv(input: $input) {
		id
		name
		updatedAt
	}
}

mutation DeleteCv($id: ID!) {
	deleteCv(id: $id)
}
```

#### src/graphql/operations/company.graphql

```graphql
query GetCompanies {
	companies {
		id
		name
		address
		zipCode
		city
		description
		createdAt
		updatedAt
	}
}

query GetCompany($id: ID!) {
	company(id: $id) {
		id
		name
		address
		zipCode
		city
		description
		createdAt
		updatedAt
		cvs {
			id
			name
		}
	}
}

mutation CreateCompany($input: CompanyCreateInput!) {
	createCompany(input: $input) {
		id
		name
		createdAt
	}
}

mutation UpdateCompany($input: CompanyUpsertInput!) {
	updateCompany(input: $input) {
		id
		name
		updatedAt
	}
}

mutation DeleteCompany($id: ID!) {
	deleteCompany(id: $id)
}
```

#### src/graphql/operations/education.graphql

```graphql
query GetEducations {
	educations {
		id
		name
		address
		zipCode
		city
		description
		createdAt
		updatedAt
	}
}

query GetEducation($id: ID!) {
	education(id: $id) {
		id
		name
		address
		zipCode
		city
		description
		createdAt
		updatedAt
		cvs {
			id
			name
		}
	}
}

mutation CreateEducation($input: EducationCreateInput!) {
	createEducation(input: $input) {
		id
		name
		createdAt
	}
}

mutation UpdateEducation($input: EducationUpsertInput!) {
	updateEducation(input: $input) {
		id
		name
		updatedAt
	}
}

mutation DeleteEducation($id: ID!) {
	deleteEducation(id: $id)
}
```

#### src/graphql/operations/project.graphql

```graphql
query GetProjects {
	projects {
		id
		name
		startDate
		endDate
		description
		createdAt
		updatedAt
	}
}

query GetProject($id: ID!) {
	project(id: $id) {
		id
		name
		startDate
		endDate
		description
		createdAt
		updatedAt
		cvs {
			id
			name
		}
	}
}

mutation CreateProject($input: ProjectCreateInput!) {
	createProject(input: $input) {
		id
		name
		createdAt
	}
}

mutation UpdateProject($input: ProjectUpsertInput!) {
	updateProject(input: $input) {
		id
		name
		updatedAt
	}
}

mutation DeleteProject($id: ID!) {
	deleteProject(id: $id)
}
```

#### src/graphql/operations/skill.graphql

```graphql
query GetSkills {
	skills {
		id
		name
		description
		levelOfMastery
		createdAt
		updatedAt
	}
}

query GetSkill($id: ID!) {
	skill(id: $id) {
		id
		name
		description
		levelOfMastery
		createdAt
		updatedAt
		cvs {
			id
			name
		}
	}
}

mutation CreateSkill($input: SkillCreateInput!) {
	createSkill(input: $input) {
		id
		name
		createdAt
	}
}

mutation UpdateSkill($input: SkillUpsertInput!) {
	updateSkill(input: $input) {
		id
		name
		updatedAt
	}
}

mutation DeleteSkill($id: ID!) {
	deleteSkill(id: $id)
}
```

## NPM Scripts

Tilføj scripts til [`package.json`](../src/Mind.Client/package.json):

```json
{
	"scripts": {
		"dev": "vite",
		"build": "tsc && vite build",
		"preview": "vite preview",
		"codegen": "graphql-codegen --config codegen.ts",
		"codegen:watch": "graphql-codegen --config codegen.ts --watch",
		"lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
		"format": "prettier --write \"src/**/*.{ts,tsx,css}\""
	}
}
```

## Genereret Output

Efter at have kørt `npm run codegen`, vil følgende fil blive genereret:

### src/graphql/generated/types.ts

Denne fil vil indeholde:

1. **TypeScript Interfaces** for alle GraphQL typer
2. **Operation Types** for hver query og mutation
3. **React Hooks** for hver operation

Eksempel på genereret output:

```typescript
// Automatisk genereret - REDIGER IKKE DENNE FIL MANUELT

export type Maybe<T> = T | null | undefined;

// Scalar types
export type Scalars = {
	ID: string;
	String: string;
	Boolean: boolean;
	Int: number;
	Float: number;
	DateTime: string;
};

// Entity types
export type Cv = {
	__typename?: 'Cv';
	id: Scalars['ID'];
	name: Scalars['String'];
	createdAt: Scalars['DateTime'];
	updatedAt: Scalars['DateTime'];
	companies?: Maybe<Array<Company>>;
	projects?: Maybe<Array<Project>>;
	educations?: Maybe<Array<Education>>;
	skills?: Maybe<Array<Skill>>;
};

export type Company = {
	__typename?: 'Company';
	id: Scalars['ID'];
	name: Scalars['String'];
	address: Scalars['String'];
	zipCode: Scalars['String'];
	city: Scalars['String'];
	description: Scalars['String'];
	createdAt: Scalars['DateTime'];
	updatedAt: Scalars['DateTime'];
	cvs?: Maybe<Array<Cv>>;
};

// Input types
export type CvCreateInput = {
	name: Scalars['String'];
	companyIds?: Maybe<Array<Scalars['ID']>>;
	projectIds?: Maybe<Array<Scalars['ID']>>;
	educationIds?: Maybe<Array<Scalars['ID']>>;
	skillIds?: Maybe<Array<Scalars['ID']>>;
};

// Query result types
export type GetCvsQuery = {
	__typename?: 'Query';
	cvs: Array<{
		__typename?: 'Cv';
		id: string;
		name: string;
		createdAt: string;
		updatedAt: string;
		companies?: Maybe<
			Array<{
				__typename?: 'Company';
				id: string;
				name: string;
			}>
		>;
	}>;
};

// Mutation result types
export type CreateCvMutation = {
	__typename?: 'Mutation';
	createCv: {
		__typename?: 'Cv';
		id: string;
		name: string;
		createdAt: string;
		updatedAt: string;
	};
};

// React Hooks
export function useGetCvsQuery(
	baseOptions?: Apollo.QueryHookOptions<GetCvsQuery, GetCvsQueryVariables>,
) {
	const options = { ...defaultOptions, ...baseOptions };
	return Apollo.useQuery<GetCvsQuery, GetCvsQueryVariables>(
		GetCvsDocument,
		options,
	);
}

export function useCreateCvMutation(
	baseOptions?: Apollo.MutationHookOptions<
		CreateCvMutation,
		CreateCvMutationVariables
	>,
) {
	const options = { ...defaultOptions, ...baseOptions };
	return Apollo.useMutation<CreateCvMutation, CreateCvMutationVariables>(
		CreateCvDocument,
		options,
	);
}

// ... og mange flere hooks
```

## Brug af Genererede Hooks

### I en komponent

```typescript
import { useGetCvsQuery, useCreateCvMutation, useDeleteCvMutation } from '@/graphql/generated/types';

function CvListPage() {
  // Brug genererede hooks direkte
  const { data, loading, error, refetch } = useGetCvsQuery();
  const [createCv, { loading: creating }] = useCreateCvMutation();
  const [deleteCv] = useDeleteCvMutation();

  const handleCreate = async (name: string) => {
    await createCv({
      variables: {
        input: { name }
      },
      // Refetch efter mutation
      refetchQueries: ['GetCvs']
    });
  };

  const handleDelete = async (id: string) => {
    await deleteCv({
      variables: { id },
      refetchQueries: ['GetCvs']
    });
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {data?.cvs.map(cv => (
        <div key={cv.id}>
          <h3>{cv.name}</h3>
          <button onClick={() => handleDelete(cv.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}
```

### Med TypeScript autocomplete

```typescript
// TypeScript kender alle felter og typer
const { data } = useGetCvQuery({ variables: { id: '123' } });

// Autocomplete virker perfekt
data?.cv.name; // ✅ TypeScript ved dette er en string
data?.cv.companies; // ✅ TypeScript ved dette er Company[]
data?.cv.unknownField; // ❌ TypeScript fejl - feltet findes ikke
```

## Workflow

### Udviklings-workflow

1. **Start API'en**:

   ```bash
   dotnet run --project src/Mind.AppHost
   ```

2. **Kør codegen i watch mode** (i en anden terminal):

   ```bash
   cd src/Mind.Client
   npm run codegen:watch
   ```

3. **Start dev server**:

   ```bash
   npm run dev
   ```

4. **Udvikl**:
   - Skriv GraphQL queries i `.graphql` filer
   - Codegen opdaterer automatisk typerne
   - Brug de genererede hooks i komponenter

### Production build

```bash
# Generer types først
npm run codegen

# Byg derefter
npm run build
```

## Git Integration

Tilføj følgende til [`.gitignore`](../src/Mind.Client/.gitignore):

```gitignore
# GraphQL Generated
src/graphql/generated/
```

**VIGTIGT**: Vi committer IKKE de genererede filer. De skal genereres som en del af build processen.

## CI/CD Integration

I din build pipeline skal du køre codegen før build:

```bash
npm ci
npm run codegen
npm run build
```

## Fordele i praksis

### Før (Manuel approach)

```typescript
// Skal manuelt definere typer
interface Cv {
	id: string;
	name: string;
	// ... mange flere felter
}

// Skal manuelt skrive queries
const GET_CVS = gql`...`;

// Skal manuelt håndtere typer
const { data } = useQuery<{ cvs: Cv[] }>(GET_CVS);
```

### Efter (Med codegen)

```typescript
// Alt er automatisk genereret
import { useGetCvsQuery } from '@/graphql/generated/types';

// Fuldt type-safe, ingen manuel definition
const { data } = useGetCvsQuery();
// data.cvs er automatisk typed korrekt
```

## Fejlhåndtering

### Schema ikke tilgængeligt

Hvis API'en ikke kører, vil codegen fejle. Løsning:

1. Start API'en først
2. Eller brug introspection file fra tidligere kørsel
3. Eller brug `schema.graphql` fil i stedet for URL

### Type konflikter

Hvis der er konflikter mellem genererede typer og manuelle typer:

1. Slet manuelle type definitioner
2. Brug kun de genererede typer fra `@/graphql/generated/types`
3. Tilpas codegen konfigurationen hvis nødvendigt

## Best Practices

1. ✅ **Navngiv queries unikt** - Brug beskrivende navne som `GetCvs`, `GetCv`, `CreateCv`
2. ✅ **Gruppér operations** - En fil per entity
3. ✅ **Kør codegen før commit** - Sikr at generated filer er opdateret
4. ✅ **Brug watch mode under udvikling** - Automatisk regenerering
5. ✅ **Import kun fra generated** - Brug ikke gamle manuelle typer
6. ✅ **Specificér alle felter** - Bed kun om de felter du skal bruge
7. ✅ **Brug fragments** - For genbrugte field selections (fremtidig forbedring)

## Fremtidige Forbedringer

### GraphQL Fragments

```graphql
fragment CvBasic on Cv {
	id
	name
	createdAt
	updatedAt
}

query GetCvs {
	cvs {
		...CvBasic
		companies {
			id
			name
		}
	}
}
```

### Optimistic Updates

Codegen genererer typer der gør optimistic updates type-safe:

```typescript
const [createCv] = useCreateCvMutation({
	optimisticResponse: {
		__typename: 'Mutation',
		createCv: {
			__typename: 'Cv',
			id: 'temp-id',
			name: 'New CV',
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		},
	},
});
```

Dette setup giver dig en moderne, type-safe GraphQL udviklings-oplevelse med minimal boilerplate!
