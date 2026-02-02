# Mind.Client UI Project - Komplet Plan

Denne mappe indeholder den komplette arkitektur- og implementationsplan for tilføjelse af Mind.Client UI projektet til Mindworking løsningen.

## 📚 Dokumenter

### 1. [mind-client-ui-architecture.md](mind-client-ui-architecture.md)

**Hovedarkitekturdokument** - Komplet oversigt over projektet:

- ✅ Teknologi stack (React, TypeScript, Vite, TailwindCSS)
- ✅ Detaljeret projektstruktur
- ✅ Design system baseret på mindworking.dk
- ✅ Feature specifikationer for alle entiteter
- ✅ GraphQL integration strategi
- ✅ Form validering patterns
- ✅ Aspire integration
- ✅ Performance og tilgængelighed
- ✅ Browser support
- ✅ Dependencies oversigt

### 2. [mind-client-architecture-diagram.md](mind-client-architecture-diagram.md)

**Visuelle diagrammer** - Mermaid diagrammer der illustrerer:

- 🔄 System overview arkitektur
- 🔄 Application flow sequences
- 🔄 Component hierarchy
- 🔄 Data flow patterns
- 🔄 Routing struktur
- 🔄 CRUD operation workflows
- 🔄 Component reusability
- 🔄 Deployment arkitektur med Aspire

### 3. [mind-client-implementation-guide.md](mind-client-implementation-guide.md)

**Implementationsguide** - Klar-til-brug kode eksempler:

- 💻 Komplette konfigurationsfiler (package.json, vite.config.ts, tsconfig.json, tailwind.config.js)
- 💻 Apollo Client setup
- 💻 TypeScript type definitioner
- 💻 Validation schemas med Yup
- 💻 Genbrugelige UI komponenter (Button, Input, Card, Table, etc.)
- 💻 Layout komponenter (Header, Navigation)
- 💻 Komplette page eksempler (CV list, create, edit)
- 💻 Root route setup
- 💻 Application entry points
- 💻 Aspire integration kode
- 💻 CORS konfiguration

### 4. [graphql-codegen-setup.md](graphql-codegen-setup.md)

**GraphQL Code Generator guide** - Automatisk generering af typer og hooks:

- ⚙️ Fordele ved code generation
- ⚙️ Installation og dependencies
- ⚙️ Komplet codegen.ts konfiguration
- ⚙️ GraphQL operations organisering (.graphql filer)
- ⚙️ NPM scripts setup
- ⚙️ Eksempler på genereret output
- ⚙️ Brug af genererede hooks i komponenter
- ⚙️ Udviklings-workflow
- ⚙️ CI/CD integration
- ⚙️ Best practices
- ⚙️ Fejlhåndtering

## 🎯 Implementationsrækkefølge

Projektet skal implementeres i følgende rækkefølge (se todo liste):

1. **Setup & Konfiguration** (Steps 1-7)
   - Initialize React + TypeScript projekt
   - Configure build tools (Vite, TypeScript, ESLint)
   - Install Tailwind CSS
   - **Setup GraphQL Code Generator** ⭐ (Ny tilføjelse)
   - Setup TanStack Router
   - Configure Apollo Client
   - Setup React Hook Form + Yup

2. **UI Fundamentals** (Steps 8-9)
   - Create shared UI components
   - Implement theme matching mindworking.dk

3. **Feature Implementation** (Steps 10-14)
   - Create CV CRUD pages
   - Create Company CRUD pages
   - Create Education CRUD pages
   - Create Project CRUD pages
   - Create Skill CRUD pages

4. **Integration** (Steps 15-17)
   - Add to Aspire AppHost
   - Update solution file
   - Configure CORS

## 🛠️ Teknologi Stack

| Kategori            | Teknologi       | Version | Formål                                   |
| ------------------- | --------------- | ------- | ---------------------------------------- |
| **UI Framework**    | React           | ^18.3.1 | Brugergrænsefladeframework               |
| **Type Safety**     | TypeScript      | ^5.5.3  | Type-sikker JavaScript                   |
| **Build Tool**      | Vite            | ^5.4.2  | Build tool og dev server                 |
| **Styling**         | TailwindCSS     | ^3.4.10 | Utility-first CSS (v4 config in CSS)     |
| **Routing**         | TanStack Router | ^1.58.3 | File-based routing                       |
| **GraphQL Client**  | Apollo Client   | ^4.0.0  | Data fetching                            |
| **Code Generation** | GraphQL Codegen | ^5.0.0  | **Auto-generering af typer og hooks** ⭐ |
| **Forms**           | React Hook Form | ^7.53.0 | Form state management                    |
| **Validation**      | Yup             | ^1.4.0  | Schema validation                        |
| **Orchestration**   | .NET Aspire     | -       | Container orchestration                  |

## 🔑 Nøglefunktioner

### GraphQL Code Generator Integration ⭐

**Stor fordel**: I stedet for at manuelt skrive GraphQL queries, mutations og TypeScript typer, genereres alt automatisk!

**Workflow**:

1. Skriv GraphQL operations i `.graphql` filer
2. Kør `npm run codegen` eller `npm run codegen:watch`
3. Brug auto-genererede hooks direkte i komponenter

**Eksempel**:

```typescript
// Før (manuelt)
const GET_CVS = gql`query GetCvs { ... }`;
const { data } = useQuery<{ cvs: Cv[] }>(GET_CVS);

// Efter (auto-generated)
import { useGetCvsQuery } from '@/graphql/generated/types';
const { data } = useGetCvsQuery(); // Fuldt type-safe!
```

### CRUD Funktionalitet for Alle Entiteter

Alle entiteter (CV, Company, Education, Project, Skill) får:

- ✅ **List view** - Tabel med alle records
- ✅ **Create** - Form til oprettelse
- ✅ **Edit** - Form til opdatering
- ✅ **Delete** - Slet med bekræftelse
- ✅ **Validation** - Client-side validation med Yup
- ✅ **Error handling** - Brugervenlige fejlmeddelelser
- ✅ **Loading states** - Loading indicators
- ✅ **Type safety** - Fuld TypeScript support via codegen

### Design System

Baseret på mindworking.dk:

- 🎨 **Farver**: Blue primary, orange accent, clean white/gray
- 🎨 **Typography**: Modern sans-serif, klar hierarki
- 🎨 **Layout**: Card-based, generøs whitespace
- 🎨 **Responsivt**: Mobile-first approach
- 🎨 **Tilgængeligt**: ARIA labels, keyboard navigation

## 📁 Projekt Struktur

```
src/Mind.Client/
├── public/                          # Static assets
├── src/
│   ├── main.tsx                     # App entry point
│   ├── routes/                      # File-based routing
│   │   ├── __root.tsx              # Root layout
│   │   ├── index.tsx               # Home
│   │   ├── cvs/                    # CV routes
│   │   ├── companies/              # Company routes
│   │   ├── education/              # Education routes
│   │   ├── projects/               # Project routes
│   │   └── skills/                 # Skill routes
│   ├── components/
│   │   ├── ui/                     # Base UI components
│   │   ├── layout/                 # Layout components
│   │   └── forms/                  # Form components
│   ├── graphql/
│   │   ├── client.ts               # Apollo setup
│   │   ├── operations/             # ⭐ GraphQL operations (.graphql filer)
│   │   └── generated/              # ⭐ Auto-genererede typer og hooks
│   ├── schemas/                    # Yup validation schemas
│   ├── types/                      # Ekstra TypeScript types
│   └── styles/
│       └── index.css               # Global styles
├── codegen.ts                      # ⭐ GraphQL codegen config
├── vite.config.ts                  # Vite config
├── tailwind.config.js              # Tailwind config
├── tsconfig.json                   # TypeScript config
└── package.json                    # Dependencies
```

## 🚀 Udviklings Workflow

### Initial Setup

```bash
cd src/Mind.Client
npm install
```

### Development (med Code Generation)

```bash
# Terminal 1: Start API
dotnet run --project src/Mind.AppHost

# Terminal 2: Watch mode for code generation
cd src/Mind.Client
npm run codegen:watch

# Terminal 3: Start dev server
cd src/Mind.Client
npm run dev
```

### Production Build

```bash
npm run codegen
npm run build
```

## 🔗 Integration med Eksisterende Løsning

### GraphQL API

- Forbinder til [`Mind.Api`](../src/Mind.Api) GraphQL endpoint
- Bruger eksisterende queries og mutations
- Apollo Client håndterer caching og state

### .NET Aspire

- Mind.Client tilføjes som NPM app i AppHost
- Service discovery via Aspire
- Automatisk port management
- CORS konfigureret i Mind.Api

### Solution Structure

```
Mindworking.slnx
├── Core/
│   └── Mind.Core
├── Application/
│   └── Mind.Application
├── Infrastructure/
│   └── Mind.Infrastructure
├── Api/
│   └── Mind.Api
├── Presentation/
│   └── Mind.Presentation.GraphQL
├── Client/                         # ⭐ Ny
│   └── Mind.Client                 # ⭐ Ny
└── Aspire/
    ├── Mind.AppHost
    └── Mind.ServiceDefaults
```

## 📊 Entiteter og Felter

### CV

- `name` (string, required)
- Relations: Companies, Projects, Educations, Skills

### Company

- `name` (string, required)
- `address` (string, required)
- `zipCode` (string, required)
- `city` (string, required)
- `description` (string, required)

### Education

- `name` (string, required)
- `address` (string, required)
- `zipCode` (string, required)
- `city` (string, required)
- `description` (string, required)

### Project

- `name` (string, required)
- `startDate` (DateTime, required)
- `endDate` (DateTime, required)
- `description` (string, required)

### Skill

- `name` (string, required)
- `description` (string, required)
- `levelOfMastery` (enum: Basis/Intermediate/Advanced)

## ✅ Best Practices

### GraphQL Code Generator

1. ✅ Navngiv queries unikt (GetCvs, GetCv, CreateCv, etc.)
2. ✅ Gruppér operations per entity i separate `.graphql` filer
3. ✅ Kør codegen før commit
4. ✅ Brug watch mode under udvikling
5. ✅ Import KUN fra generated typer
6. ✅ Commit ikke generated filer til git

### Component Development

1. ✅ Genbrugelige UI komponenter i `components/ui/`
2. ✅ Type-safe props med TypeScript
3. ✅ Accessible markup (ARIA labels)
4. ✅ Responsive design (mobile-first)

### Form Handling

1. ✅ React Hook Form for state management
2. ✅ Yup for validation
3. ✅ Brugervenlige fejlmeddelelser på dansk
4. ✅ Loading states under submission

### Data Fetching

1. ✅ Brug auto-genererede hooks fra codegen
2. ✅ Handle loading og error states
3. ✅ Refetch efter mutations
4. ✅ Optimistic updates hvor relevant

## 🎓 Næste Skridt

For at implementere denne plan:

1. **Review** disse dokumenter grundigt
2. **Diskutér** eventuelle ændringer eller tilføjelser
3. **Godkend** planen
4. **Switch til Code mode** for implementering
5. **Følg todo listen** trin for trin

## 📝 Noter

- Alle kode eksempler er klar til brug
- GraphQL Code Generator eliminerer meget boilerplate
- Design følger mindworking.dk's visuelle identitet
- Projektet integrerer problemfrit med eksisterende .NET løsning
- Fuld type-sikkerhed gennem hele stakken
- Moderne, maintainable arkitektur

---

**Udarbejdet**: 2026-02-02  
**Dokumenter**: 4 filer  
**Todo Items**: 17 steps  
**Estimeret Kompleksitet**: Medium til Høj
