# Mind.Client Implementation Guide

This guide provides detailed implementation examples for the Mind.Client UI project.

## 1. Project Initialization

### package.json

```json
{
	"name": "mind-client",
	"private": true,
	"version": "1.0.0",
	"type": "module",
	"scripts": {
		"dev": "vite",
		"build": "tsc && vite build",
		"preview": "vite preview",
		"codegen": "graphql-codegen --config codegen.ts",
		"codegen:watch": "graphql-codegen --config codegen.ts --watch",
		"lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
		"format": "prettier --write \"src/**/*.{ts,tsx,css}\""
	},
	"dependencies": {
		"react": "^18.3.1",
		"react-dom": "^18.3.1",
		"@tanstack/react-router": "^1.58.3",
		"@apollo/client": "^4.0.0",
		"graphql": "^16.9.0",
		"react-hook-form": "^7.53.0",
		"@hookform/resolvers": "^3.9.0",
		"yup": "^1.4.0"
	},
	"devDependencies": {
		"@types/react": "^18.3.5",
		"@types/react-dom": "^18.3.0",
		"@vitejs/plugin-react": "^4.3.1",
		"typescript": "^5.5.3",
		"vite": "^5.4.2",
		"eslint": "^8.57.0",
		"@typescript-eslint/eslint-plugin": "^7.18.0",
		"@typescript-eslint/parser": "^7.18.0",
		"eslint-plugin-react-hooks": "^4.6.2",
		"eslint-plugin-react-refresh": "^0.4.9",
		"prettier": "^3.3.3",
		"tailwindcss": "^3.4.10",
		"autoprefixer": "^10.4.20",
		"postcss": "^8.4.41",
		"@tanstack/router-devtools": "^1.58.3",
		"@tanstack/router-vite-plugin": "^1.58.4",
		"@graphql-codegen/cli": "^5.0.0",
		"@graphql-codegen/typescript": "^4.0.1",
		"@graphql-codegen/typescript-operations": "^4.0.1",
		"@graphql-codegen/typescript-react-apollo": "^4.1.0",
		"@graphql-codegen/introspection": "^4.0.0"
	}
}
```

## 2. Configuration Files

### vite.config.ts

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { TanStackRouterVite } from '@tanstack/router-vite-plugin';
import path from 'path';

export default defineConfig({
	plugins: [react(), TanStackRouterVite()],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
		},
	},
	server: {
		port: 5173,
		proxy: {
			'/graphql': {
				target: 'http://localhost:8080',
				changeOrigin: true,
			},
		},
	},
});
```

### tsconfig.json

```json
{
	"compilerOptions": {
		"target": "ES2020",
		"useDefineForClassFields": true,
		"lib": ["ES2020", "DOM", "DOM.Iterable"],
		"module": "ESNext",
		"skipLibCheck": true,
		"moduleResolution": "bundler",
		"allowImportingTsExtensions": true,
		"resolveJsonModule": true,
		"isolatedModules": true,
		"noEmit": true,
		"jsx": "react-jsx",
		"strict": true,
		"noUnusedLocals": true,
		"noUnusedParameters": true,
		"noFallthroughCasesInSwitch": true,
		"baseUrl": ".",
		"paths": {
			"@/*": ["./src/*"]
		}
	},
	"include": ["src"],
	"references": [{ "path": "./tsconfig.node.json" }]
}
```

### tailwind.config.js

```javascript
/** @type {import('tailwindcss').Config} */
export default {
	content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		extend: {
			colors: {
				primary: {
					50: '#eff6ff',
					100: '#dbeafe',
					200: '#bfdbfe',
					300: '#93c5fd',
					400: '#60a5fa',
					500: '#3b82f6',
					600: '#2563eb',
					700: '#1d4ed8',
					800: '#1e40af',
					900: '#1e3a8a',
				},
				accent: {
					50: '#fff7ed',
					100: '#ffedd5',
					200: '#fed7aa',
					300: '#fdba74',
					400: '#fb923c',
					500: '#f97316',
					600: '#ea580c',
					700: '#c2410c',
					800: '#9a3412',
					900: '#7c2d12',
				},
			},
			fontFamily: {
				sans: [
					'system-ui',
					'-apple-system',
					'BlinkMacSystemFont',
					'Segoe UI',
					'Roboto',
					'sans-serif',
				],
			},
		},
	},
	plugins: [],
};
```

## 3. Apollo Client Setup

### src/graphql/client.ts

```typescript
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';

const httpLink = createHttpLink({
	uri: '/graphql',
	credentials: 'include',
});

export const apolloClient = new ApolloClient({
	link: httpLink,
	cache: new InMemoryCache({
		typePolicies: {
			Query: {
				fields: {
					cvs: {
						merge: false,
					},
					companies: {
						merge: false,
					},
					education: {
						merge: false,
					},
					projects: {
						merge: false,
					},
					skills: {
						merge: false,
					},
				},
			},
		},
	}),
	defaultOptions: {
		watchQuery: {
			fetchPolicy: 'cache-and-network',
		},
	},
});
```

## 4. GraphQL Operations Examples

### src/graphql/queries/cv.queries.ts

```typescript
import { gql } from '@apollo/client';

export const GET_CVS = gql`
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

export const GET_CV = gql`
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
```

### src/graphql/mutations/cv.mutations.ts

```typescript
import { gql } from '@apollo/client';

export const CREATE_CV = gql`
	mutation CreateCv($input: CvCreateInput!) {
		createCv(input: $input) {
			id
			name
			createdAt
			updatedAt
		}
	}
`;

export const UPDATE_CV = gql`
	mutation UpdateCv($input: CvUpdateInput!) {
		updateCv(input: $input) {
			id
			name
			updatedAt
		}
	}
`;

export const DELETE_CV = gql`
	mutation DeleteCv($id: ID!) {
		deleteCv(id: $id)
	}
`;
```

## 5. Type Definitions

### src/types/cv.types.ts

```typescript
export interface Cv {
	id: string;
	name: string;
	createdAt: string;
	updatedAt: string;
	companies?: Company[];
	projects?: Project[];
	educations?: Education[];
	skills?: Skill[];
}

export interface CvCreateInput {
	name: string;
	companyIds?: string[];
	projectIds?: string[];
	educationIds?: string[];
	skillIds?: string[];
}

export interface CvUpdateInput {
	id: string;
	name: string;
	companyIds?: string[];
	projectIds?: string[];
	educationIds?: string[];
	skillIds?: string[];
}
```

### src/types/company.types.ts

```typescript
export interface Company {
	id: string;
	name: string;
	address: string;
	zipCode: string;
	city: string;
	description: string;
	createdAt: string;
	updatedAt: string;
}

export interface CompanyCreateInput {
	name: string;
	address: string;
	zipCode: string;
	city: string;
	description: string;
}

export interface CompanyUpsertInput extends CompanyCreateInput {
	id: string;
}
```

## 6. Validation Schemas

### src/schemas/cv.schema.ts

```typescript
import * as yup from 'yup';

export const cvSchema = yup.object({
	name: yup
		.string()
		.required('Navn er påkrævet')
		.min(2, 'Navn skal være mindst 2 tegn')
		.max(200, 'Navn må højst være 200 tegn'),
	companyIds: yup.array().of(yup.string()),
	projectIds: yup.array().of(yup.string()),
	educationIds: yup.array().of(yup.string()),
	skillIds: yup.array().of(yup.string()),
});

export type CvFormData = yup.InferType<typeof cvSchema>;
```

### src/schemas/company.schema.ts

```typescript
import * as yup from 'yup';

export const companySchema = yup.object({
	name: yup
		.string()
		.required('Navn er påkrævet')
		.max(200, 'Navn må højst være 200 tegn'),
	address: yup
		.string()
		.required('Adresse er påkrævet')
		.max(500, 'Adresse må højst være 500 tegn'),
	zipCode: yup
		.string()
		.required('Postnummer er påkrævet')
		.max(20, 'Postnummer må højst være 20 tegn'),
	city: yup
		.string()
		.required('By er påkrævet')
		.max(100, 'By må højst være 100 tegn'),
	description: yup.string().required('Beskrivelse er påkrævet'),
});

export type CompanyFormData = yup.InferType<typeof companySchema>;
```

## 7. Custom Hooks

### src/hooks/useCvs.ts

```typescript
import { useQuery, useMutation } from '@apollo/client';
import { GET_CVS, GET_CV } from '@/graphql/queries/cv.queries';
import {
	CREATE_CV,
	UPDATE_CV,
	DELETE_CV,
} from '@/graphql/mutations/cv.mutations';
import { Cv, CvCreateInput, CvUpdateInput } from '@/types/cv.types';

export const useCvs = () => {
	const { data, loading, error, refetch } = useQuery<{ cvs: Cv[] }>(GET_CVS);

	return {
		cvs: data?.cvs || [],
		loading,
		error,
		refetch,
	};
};

export const useCv = (id: string) => {
	const { data, loading, error } = useQuery<{ cv: Cv }>(GET_CV, {
		variables: { id },
		skip: !id,
	});

	return {
		cv: data?.cv,
		loading,
		error,
	};
};

export const useCreateCv = () => {
	const [createCv, { loading, error }] = useMutation<
		{ createCv: Cv },
		{ input: CvCreateInput }
	>(CREATE_CV, {
		refetchQueries: [{ query: GET_CVS }],
	});

	return {
		createCv: (input: CvCreateInput) => createCv({ variables: { input } }),
		loading,
		error,
	};
};

export const useUpdateCv = () => {
	const [updateCv, { loading, error }] = useMutation<
		{ updateCv: Cv },
		{ input: CvUpdateInput }
	>(UPDATE_CV, {
		refetchQueries: [{ query: GET_CVS }],
	});

	return {
		updateCv: (input: CvUpdateInput) => updateCv({ variables: { input } }),
		loading,
		error,
	};
};

export const useDeleteCv = () => {
	const [deleteCv, { loading, error }] = useMutation<
		{ deleteCv: boolean },
		{ id: string }
	>(DELETE_CV, {
		refetchQueries: [{ query: GET_CVS }],
	});

	return {
		deleteCv: (id: string) => deleteCv({ variables: { id } }),
		loading,
		error,
	};
};
```

## 8. UI Components

### src/components/ui/Button.tsx

```typescript
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled,
  className = '',
  ...props
}) => {
  const baseStyles = 'font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';

  const variantStyles = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 disabled:bg-primary-300',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500 disabled:bg-gray-100',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 disabled:bg-red-300',
    ghost: 'bg-transparent text-primary-600 hover:bg-primary-50 focus:ring-primary-500',
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className} disabled:cursor-not-allowed`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Behandler...
        </span>
      ) : (
        children
      )}
    </button>
  );
};
```

### src/components/ui/Input.tsx

```typescript
import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <input
          ref={ref}
          className={`
            w-full px-3 py-2 border rounded-lg
            focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
            disabled:bg-gray-100 disabled:cursor-not-allowed
            ${error ? 'border-red-500' : 'border-gray-300'}
            ${className}
          `}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
```

### src/components/ui/Card.tsx

```typescript
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  actions?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ children, className = '', title, actions }) => {
  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden ${className}`}>
      {(title || actions) && (
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          {title && <h3 className="text-lg font-semibold text-gray-900">{title}</h3>}
          {actions && <div className="flex gap-2">{actions}</div>}
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  );
};
```

### src/components/ui/Table.tsx

```typescript
import React from 'react';

interface Column<T> {
  header: string;
  accessor: keyof T | ((row: T) => React.ReactNode);
  className?: string;
}

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  onRowClick?: (row: T) => void;
  emptyMessage?: string;
}

export function Table<T extends { id: string }>({
  data,
  columns,
  onRowClick,
  emptyMessage = 'Ingen data tilgængelig',
}: TableProps<T>) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column, index) => (
              <th
                key={index}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-6 py-8 text-center text-gray-500">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr
                key={row.id}
                onClick={() => onRowClick?.(row)}
                className={onRowClick ? 'hover:bg-gray-50 cursor-pointer' : ''}
              >
                {columns.map((column, colIndex) => (
                  <td key={colIndex} className={`px-6 py-4 ${column.className || ''}`}>
                    {typeof column.accessor === 'function'
                      ? column.accessor(row)
                      : String(row[column.accessor])}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
```

## 9. Layout Components

### src/components/layout/Header.tsx

```typescript
import React from 'react';
import { Link } from '@tanstack/react-router';

export const Header: React.FC = () => {
  return (
    <header className="bg-primary-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold hover:text-primary-100">
            Mindworking CV
          </Link>
          <nav className="flex gap-6">
            <Link
              to="/cvs"
              className="hover:text-primary-100 transition-colors"
              activeProps={{ className: 'border-b-2 border-white' }}
            >
              CV'er
            </Link>
            <Link
              to="/companies"
              className="hover:text-primary-100 transition-colors"
              activeProps={{ className: 'border-b-2 border-white' }}
            >
              Virksomheder
            </Link>
            <Link
              to="/education"
              className="hover:text-primary-100 transition-colors"
              activeProps={{ className: 'border-b-2 border-white' }}
            >
              Uddannelser
            </Link>
            <Link
              to="/projects"
              className="hover:text-primary-100 transition-colors"
              activeProps={{ className: 'border-b-2 border-white' }}
            >
              Projekter
            </Link>
            <Link
              to="/skills"
              className="hover:text-primary-100 transition-colors"
              activeProps={{ className: 'border-b-2 border-white' }}
            >
              Færdigheder
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};
```

## 10. Page Examples

### src/routes/cvs/index.tsx

```typescript
import { createFileRoute, Link } from '@tanstack/react-router';
import { useCvs, useDeleteCv } from '@/hooks/useCvs';
import { Table } from '@/components/ui/Table';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Cv } from '@/types/cv.types';

export const Route = createFileRoute('/cvs/')({
  component: CvListPage,
});

function CvListPage() {
  const { cvs, loading, error } = useCvs();
  const { deleteCv, loading: deleteLoading } = useDeleteCv();

  const handleDelete = async (id: string) => {
    if (window.confirm('Er du sikker på, at du vil slette dette CV?')) {
      try {
        await deleteCv(id);
      } catch (err) {
        console.error('Failed to delete CV:', err);
        alert('Kunne ikke slette CV');
      }
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Indlæser...</div>;
  }

  if (error) {
    return (
      <div className="text-red-600 text-center p-4">
        Fejl ved indlæsning af CV'er: {error.message}
      </div>
    );
  }

  const columns = [
    {
      header: 'Navn',
      accessor: 'name' as keyof Cv,
    },
    {
      header: 'Antal virksomheder',
      accessor: (cv: Cv) => cv.companies?.length || 0,
    },
    {
      header: 'Antal projekter',
      accessor: (cv: Cv) => cv.projects?.length || 0,
    },
    {
      header: 'Handlinger',
      accessor: (cv: Cv) => (
        <div className="flex gap-2">
          <Link to={`/cvs/$id/edit`} params={{ id: cv.id }}>
            <Button size="sm" variant="secondary">
              Rediger
            </Button>
          </Link>
          <Button
            size="sm"
            variant="danger"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(cv.id);
            }}
            isLoading={deleteLoading}
          >
            Slet
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <Card
        title="CV'er"
        actions={
          <Link to="/cvs/create">
            <Button>Opret nyt CV</Button>
          </Link>
        }
      >
        <Table data={cvs} columns={columns} emptyMessage="Ingen CV'er fundet" />
      </Card>
    </div>
  );
}
```

### src/routes/cvs/create.tsx

```typescript
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useCreateCv } from '@/hooks/useCvs';
import { cvSchema, type CvFormData } from '@/schemas/cv.schema';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export const Route = createFileRoute('/cvs/create')({
  component: CreateCvPage,
});

function CreateCvPage() {
  const navigate = useNavigate();
  const { createCv, loading } = useCreateCv();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CvFormData>({
    resolver: yupResolver(cvSchema),
  });

  const onSubmit = async (data: CvFormData) => {
    try {
      await createCv(data);
      navigate({ to: '/cvs' });
    } catch (err) {
      console.error('Failed to create CV:', err);
      alert('Kunne ikke oprette CV');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card title="Opret nyt CV">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Navn"
            {...register('name')}
            error={errors.name?.message}
            required
            placeholder="Indtast CV navn"
          />

          <div className="flex gap-4 justify-end pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate({ to: '/cvs' })}
            >
              Annuller
            </Button>
            <Button type="submit" isLoading={loading}>
              Opret CV
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
```

## 11. Root Route Setup

### src/routes/\_\_root.tsx

```typescript
import { createRootRoute, Outlet } from '@tanstack/react-router';
import { Header } from '@/components/layout/Header';

export const Route = createRootRoute({
  component: RootLayout,
});

function RootLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main>
        <Outlet />
      </main>
    </div>
  );
}
```

## 12. Application Entry Points

### src/main.tsx

```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ApolloProvider } from '@apollo/client';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { apolloClient } from './graphql/client';
import { routeTree } from './routeTree.gen';
import './styles/index.css';

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ApolloProvider client={apolloClient}>
      <RouterProvider router={router} />
    </ApolloProvider>
  </React.StrictMode>
);
```

### src/styles/index.css

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
	body {
		@apply font-sans antialiased;
	}
}
```

### index.html

```html
<!DOCTYPE html>
<html lang="da">
	<head>
		<meta charset="UTF-8" />
		<link rel="icon" type="image/svg+xml" href="/vite.svg" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<title>Mindworking CV</title>
	</head>
	<body>
		<div id="root"></div>
		<script type="module" src="/src/main.tsx"></script>
	</body>
</html>
```

## 13. Aspire Integration

### Updated AppHost.cs

```csharp
var builder = DistributedApplication.CreateBuilder(args);

var postgresPassword = builder.AddParameter("postgres-password", "postgres", secret: true);

var postgres = builder
    .AddPostgres("postgres")
    .WithPassword(postgresPassword)
    .WithDataVolume("mind-postgres-data");

var mindDb = postgres.AddDatabase("minddb");

builder
    .AddContainer("adminer", "adminer", "latest")
    .WithHttpEndpoint(targetPort: 8080, name: "http")
    .WithEnvironment("ADMINER_DEFAULT_SERVER", "postgres")
    .WaitFor(postgres);

var api = builder
    .AddProject<Projects.Mind_Api>("mind-api")
    .WithReference(mindDb)
    .WaitFor(mindDb);

builder
    .AddNpmApp("mind-client", "../Mind.Client")
    .WithHttpEndpoint(port: 5173, env: "PORT")
    .WithExternalHttpEndpoints()
    .WithEnvironment("VITE_API_URL", api.GetEndpoint("http"))
    .WaitFor(api);

builder.Build().Run();
```

### Updated Mind.Api Program.cs (CORS)

```csharp
// Add after builder.AddServiceDefaults();
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins(
            "http://localhost:5173",
            "https://localhost:5173"
        )
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials();
    });
});

// Add before app.UseHttpsRedirection();
app.UseCors();
```

This implementation guide provides all the essential code examples needed to build the Mind.Client application.
