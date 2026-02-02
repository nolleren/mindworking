# Mind.Client UI Project Architecture Plan

## Overview

This document outlines the architecture and implementation plan for adding a React + TypeScript UI project to the Mindworking solution. The project will be located at [`src/Mind.Client`](../src/Mind.Client) and follow the same organizational pattern as other projects in the solution.

## Technology Stack

### Core Technologies

- **React 18** - UI framework
- **TypeScript 5** - Type-safe JavaScript
- **Vite** - Build tool and dev server
- **TailwindCSS** - Utility-first CSS framework

### Routing

- **TanStack Router** - File-based routing system
- File-based routing structure in [`src/routes`](../src/Mind.Client/src/routes)

### State Management & Data Fetching

- **Apollo Client** - GraphQL client for API communication
- Connects to existing GraphQL API at [`src/Mind.Api`](../src/Mind.Api)
- GraphQL endpoint: `/graphql`

### Form Management

- **React Hook Form** - Performant form state management
- **Yup** - Schema validation for forms

## Project Structure

```
src/Mind.Client/
├── public/                          # Static assets
├── src/
│   ├── main.tsx                     # Application entry point
│   ├── App.tsx                      # Root component
│   ├── routes/                      # File-based routing
│   │   ├── __root.tsx              # Root layout
│   │   ├── index.tsx               # Home page
│   │   ├── cvs/
│   │   │   ├── index.tsx           # CV list page
│   │   │   ├── create.tsx          # Create CV page
│   │   │   └── $id.edit.tsx        # Edit CV page
│   │   ├── companies/
│   │   │   ├── index.tsx           # Company list
│   │   │   ├── create.tsx          # Create company
│   │   │   └── $id.edit.tsx        # Edit company
│   │   ├── education/
│   │   │   ├── index.tsx           # Education list
│   │   │   ├── create.tsx          # Create education
│   │   │   └── $id.edit.tsx        # Edit education
│   │   ├── projects/
│   │   │   ├── index.tsx           # Project list
│   │   │   ├── create.tsx          # Create project
│   │   │   └── $id.edit.tsx        # Edit project
│   │   └── skills/
│   │       ├── index.tsx           # Skill list
│   │       ├── create.tsx          # Create skill
│   │       └── $id.edit.tsx        # Edit skill
│   ├── components/                  # Reusable UI components
│   │   ├── ui/                     # Base UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Select.tsx
│   │   │   ├── TextArea.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Modal.tsx
│   │   │   └── Table.tsx
│   │   ├── layout/                 # Layout components
│   │   │   ├── Header.tsx
│   │   │   ├── Navigation.tsx
│   │   │   └── Footer.tsx
│   │   └── forms/                  # Form-specific components
│   │       ├── CvForm.tsx
│   │       ├── CompanyForm.tsx
│   │       ├── EducationForm.tsx
│   │       ├── ProjectForm.tsx
│   │       └── SkillForm.tsx
│   ├── graphql/                    # GraphQL operations
│   │   ├── client.ts               # Apollo Client setup
│   │   ├── queries/
│   │   │   ├── cv.queries.ts
│   │   │   ├── company.queries.ts
│   │   │   ├── education.queries.ts
│   │   │   ├── project.queries.ts
│   │   │   └── skill.queries.ts
│   │   └── mutations/
│   │       ├── cv.mutations.ts
│   │       ├── company.mutations.ts
│   │       ├── education.mutations.ts
│   │       ├── project.mutations.ts
│   │       └── skill.mutations.ts
│   ├── schemas/                    # Yup validation schemas
│   │   ├── cv.schema.ts
│   │   ├── company.schema.ts
│   │   ├── education.schema.ts
│   │   ├── project.schema.ts
│   │   └── skill.schema.ts
│   ├── types/                      # TypeScript type definitions
│   │   ├── cv.types.ts
│   │   ├── company.types.ts
│   │   ├── education.types.ts
│   │   ├── project.types.ts
│   │   └── skill.types.ts
│   ├── hooks/                      # Custom React hooks
│   │   ├── useCvs.ts
│   │   ├── useCompanies.ts
│   │   ├── useEducation.ts
│   │   ├── useProjects.ts
│   │   └── useSkills.ts
│   └── styles/
│       └── index.css               # Global styles & Tailwind imports
├── .eslintrc.json                  # ESLint configuration
├── .prettierrc                     # Prettier configuration
├── tsconfig.json                   # TypeScript configuration
├── tsconfig.node.json              # TypeScript config for build tools
├── vite.config.ts                  # Vite configuration
├── tailwind.config.js              # Tailwind configuration
├── postcss.config.js               # PostCSS configuration
├── package.json                    # NPM dependencies
└── index.html                      # HTML entry point
```

## Design System (Based on mindworking.dk)

### Color Palette

From the Mindworking website analysis:

- **Primary**: Blue tones (navigation, links, primary actions)
- **Secondary**: White/light gray backgrounds
- **Accent**: Orange/coral for CTAs and highlights
- **Text**: Dark gray/black for primary text
- **Borders**: Light gray for separators

### Typography

- **Font Family**: Modern sans-serif (likely system fonts or similar)
- **Headings**: Bold, clear hierarchy
- **Body**: Readable, comfortable line-height

### Layout Principles

- Clean, minimal design
- Generous white space
- Card-based components for content grouping
- Responsive grid layouts
- Mobile-first approach

## Key Features by Entity

### CV Management

- **List View**: Display all CVs with name, created/updated dates
- **Create**: Form with name field and ability to associate entities
- **Edit**: Update CV details and manage relationships
- **Delete**: Remove CV with confirmation dialog
- **Details**: View full CV with all associated entities

### Company Management

- **List View**: Table with name, city, description preview
- **Create/Edit Form Fields**:
  - Name (required)
  - Address (required)
  - Zip Code (required)
  - City (required)
  - Description (required)
- **Associate with CVs**: Multi-select for CV relationships

### Education Management

- **List View**: Table with name, city, description preview
- **Create/Edit Form Fields**:
  - Name (required)
  - Address (required)
  - Zip Code (required)
  - City (required)
  - Description (required)
- **Associate with CVs**: Multi-select for CV relationships

### Project Management

- **List View**: Table with name, dates, description preview
- **Create/Edit Form Fields**:
  - Name (required)
  - Start Date (required, date picker)
  - End Date (required, date picker)
  - Description (required, rich text)
- **Associate with CVs**: Multi-select for CV relationships

### Skill Management

- **List View**: Table with name, mastery level, description preview
- **Create/Edit Form Fields**:
  - Name (required)
  - Description (required)
  - Level of Mastery (select: Basis/Intermediate/Advanced)
- **Associate with CVs**: Multi-select for CV relationships

## GraphQL Integration

### Queries

All entities support:

- `getAll` - Fetch list of entities
- `getById` - Fetch single entity with relationships

Example for CV:

```graphql
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
```

### Mutations

All entities support:

- `create` - Create new entity
- `update` - Update existing entity
- `delete` - Remove entity

Example for CV:

```graphql
mutation CreateCv($input: CvCreateInput!) {
	createCv(input: $input) {
		id
		name
		createdAt
	}
}
```

## Form Validation Patterns

Using Yup schemas for consistent validation:

```typescript
// Example: CV Schema
const cvSchema = yup.object({
	name: yup
		.string()
		.required('Name is required')
		.min(2, 'Name must be at least 2 characters')
		.max(200, 'Name must not exceed 200 characters'),
});

// Example: Company Schema
const companySchema = yup.object({
	name: yup.string().required('Name is required').max(200),
	address: yup.string().required('Address is required').max(500),
	zipCode: yup.string().required('Zip code is required').max(20),
	city: yup.string().required('City is required').max(100),
	description: yup.string().required('Description is required'),
});
```

## Routing Structure

Using TanStack Router file-based routing:

- `/` - Home/Dashboard
- `/cvs` - CV list
- `/cvs/create` - Create new CV
- `/cvs/:id/edit` - Edit CV
- `/companies` - Company list
- `/companies/create` - Create company
- `/companies/:id/edit` - Edit company
- `/education` - Education list
- `/education/create` - Create education
- `/education/:id/edit` - Edit education
- `/projects` - Project list
- `/projects/create` - Create project
- `/projects/:id/edit` - Edit project
- `/skills` - Skill list
- `/skills/create` - Create skill
- `/skills/:id/edit` - Edit skill

## Integration with .NET Aspire

The Mind.Client will be added to [`AppHost.cs`](../src/Mind.AppHost/AppHost.cs):

```csharp
var client = builder
    .AddNpmApp("mind-client", "../Mind.Client")
    .WithHttpEndpoint(port: 5173, env: "PORT")
    .WithExternalHttpEndpoints()
    .PublishAsDockerFile();

builder
    .AddProject<Projects.Mind_Api>("mind-api")
    .WithReference(mindDb)
    .WithReference(client)  // Allow API to know about client
    .WaitFor(mindDb);
```

## CORS Configuration

Update [`Program.cs`](../src/Mind.Api/Program.cs) to allow client requests:

```csharp
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins("http://localhost:5173", "https://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// In app configuration
app.UseCors();
```

## Development Workflow

1. **Start Development**:

   ```bash
   cd src/Mind.Client
   npm run dev
   ```

2. **Run with Aspire**:

   ```bash
   # From solution root
   dotnet run --project src/Mind.AppHost
   ```

3. **Build for Production**:
   ```bash
   cd src/Mind.Client
   npm run build
   ```

## Testing Strategy

- **Unit Tests**: Vitest for component and utility testing
- **Integration Tests**: Testing Library for user interaction flows
- **E2E Tests**: Playwright for full application testing
- **GraphQL Mocking**: MSW (Mock Service Worker) for development

## Performance Considerations

- **Code Splitting**: Route-based code splitting via Vite
- **Lazy Loading**: Dynamic imports for heavy components
- **Apollo Caching**: Leverage Apollo's normalized cache
- **Optimistic Updates**: For better UX on mutations
- **Pagination**: Implement for large lists (future enhancement)

## Accessibility

- Semantic HTML throughout
- ARIA labels where needed
- Keyboard navigation support
- Focus management
- Screen reader compatibility

## Browser Support

- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)

## Dependencies Summary

### Production Dependencies

```json
{
	"react": "^18.3.1",
	"react-dom": "^18.3.1",
	"@tanstack/react-router": "^1.x",
	"@apollo/client": "^4.x",
	"graphql": "^16.x",
	"react-hook-form": "^7.x",
	"@hookform/resolvers": "^3.x",
	"yup": "^1.x",
	"tailwindcss": "^3.x"
}
```

### Development Dependencies

```json
{
	"@types/react": "^18.3.x",
	"@types/react-dom": "^18.3.x",
	"@vitejs/plugin-react": "^4.x",
	"typescript": "^5.x",
	"vite": "^5.x",
	"eslint": "^8.x",
	"prettier": "^3.x",
	"autoprefixer": "^10.x",
	"postcss": "^8.x",
	"@graphql-codegen/cli": "^5.x",
	"@graphql-codegen/typescript": "^4.x",
	"@graphql-codegen/typescript-operations": "^4.x",
	"@graphql-codegen/typescript-react-apollo": "^4.x"
}
```

## Implementation Phases

The implementation will follow the todo list in sequential order, ensuring each phase is complete and tested before moving to the next.

## Future Enhancements

- User authentication and authorization
- Real-time updates via GraphQL subscriptions
- Export CV as PDF
- CV templates and theming
- Search and filtering capabilities
- Drag-and-drop reordering
- Bulk operations
- Activity logging and audit trail
