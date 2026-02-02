# Mind.Client Architecture Diagrams

## System Overview

```mermaid
graph TB
    subgraph Client["Mind.Client - React SPA"]
        UI[UI Components]
        Router[TanStack Router]
        Apollo[Apollo Client]
        Forms[React Hook Form + Yup]
    end

    subgraph API["Mind.Api - GraphQL API"]
        GraphQL[GraphQL Server]
        Presentation[Mind.Presentation.GraphQL]
    end

    subgraph Backend["Backend Services"]
        Application[Mind.Application]
        Infrastructure[Mind.Infrastructure]
        Core[Mind.Core]
    end

    subgraph Data["Data Layer"]
        Postgres[(PostgreSQL)]
    end

    subgraph Orchestration["Aspire AppHost"]
        AppHost[Mind.AppHost]
    end

    UI --> Router
    Router --> Apollo
    Forms --> Apollo
    Apollo -->|HTTP/GraphQL| GraphQL
    GraphQL --> Presentation
    Presentation --> Application
    Application --> Infrastructure
    Infrastructure --> Core
    Infrastructure --> Postgres
    AppHost -.->|Orchestrates| Client
    AppHost -.->|Orchestrates| API
    AppHost -.->|Orchestrates| Postgres
```

## Application Flow

```mermaid
sequenceDiagram
    participant User
    participant UI as React Component
    participant Form as React Hook Form
    participant Apollo as Apollo Client
    participant API as GraphQL API
    participant Service as Domain Service
    participant DB as Database

    User->>UI: Navigate to page
    UI->>Apollo: Query data
    Apollo->>API: GraphQL Query
    API->>Service: Process request
    Service->>DB: Fetch data
    DB-->>Service: Return data
    Service-->>API: Return result
    API-->>Apollo: GraphQL Response
    Apollo-->>UI: Update cache & component
    UI-->>User: Display data

    User->>Form: Fill form & submit
    Form->>Form: Validate with Yup
    Form->>Apollo: Execute mutation
    Apollo->>API: GraphQL Mutation
    API->>Service: Process mutation
    Service->>DB: Update data
    DB-->>Service: Confirm
    Service-->>API: Return result
    API-->>Apollo: Mutation response
    Apollo->>Apollo: Update cache
    Apollo-->>UI: Trigger re-render
    UI-->>User: Show success
```

## Component Hierarchy

```mermaid
graph TD
    App[App.tsx]
    Root[__root.tsx - Layout]

    App --> Root

    Root --> Home[index.tsx - Home]
    Root --> CvList[cvs/index.tsx]
    Root --> CvCreate[cvs/create.tsx]
    Root --> CvEdit[cvs/$id.edit.tsx]

    Root --> CompanyList[companies/index.tsx]
    Root --> CompanyCreate[companies/create.tsx]
    Root --> CompanyEdit[companies/$id.edit.tsx]

    Root --> EducationList[education/index.tsx]
    Root --> EducationCreate[education/create.tsx]
    Root --> EducationEdit[education/$id.edit.tsx]

    Root --> ProjectList[projects/index.tsx]
    Root --> ProjectCreate[projects/create.tsx]
    Root --> ProjectEdit[projects/$id.edit.tsx]

    Root --> SkillList[skills/index.tsx]
    Root --> SkillCreate[skills/create.tsx]
    Root --> SkillEdit[skills/$id.edit.tsx]

    style App fill:#e1f5ff
    style Root fill:#bbdefb
    style Home fill:#90caf9
    style CvList fill:#fff9c4
    style CompanyList fill:#fff9c4
    style EducationList fill:#fff9c4
    style ProjectList fill:#fff9c4
    style SkillList fill:#fff9c4
```

## Data Flow Pattern

```mermaid
graph LR
    subgraph Page["Page Component"]
        Hook[useEntity Hook]
        Component[List/Form Component]
    end

    subgraph Apollo["Apollo Layer"]
        Query[GraphQL Query]
        Mutation[GraphQL Mutation]
        Cache[Apollo Cache]
    end

    subgraph Validation["Validation Layer"]
        Schema[Yup Schema]
        RHF[React Hook Form]
    end

    Component --> Hook
    Hook --> Query
    Hook --> Mutation

    Component --> RHF
    RHF --> Schema
    Schema -.->|Valid| Mutation

    Query --> Cache
    Mutation --> Cache
    Cache -.->|Update| Component

    Query -->|HTTP| API[GraphQL API]
    Mutation -->|HTTP| API
```

## Routing Structure

```mermaid
graph TD
    Root[/ - Root Layout]

    Root --> Index[/index - Home]

    Root --> Cvs[/cvs - CV List]
    Root --> CvCreate[/cvs/create - Create CV]
    Root --> CvEdit[/cvs/:id/edit - Edit CV]

    Root --> Companies[/companies - Company List]
    Root --> CompanyCreate[/companies/create - Create Company]
    Root --> CompanyEdit[/companies/:id/edit - Edit Company]

    Root --> Education[/education - Education List]
    Root --> EducationCreate[/education/create - Create Education]
    Root --> EducationEdit[/education/:id/edit - Edit Education]

    Root --> Projects[/projects - Project List]
    Root --> ProjectCreate[/projects/create - Create Project]
    Root --> ProjectEdit[/projects/:id/edit - Edit Project]

    Root --> Skills[/skills - Skill List]
    Root --> SkillCreate[/skills/create - Create Skill]
    Root --> SkillEdit[/skills/:id/edit - Edit Skill]

    style Root fill:#e1bee7
    style Index fill:#ce93d8
    style Cvs fill:#fff9c4
    style Companies fill:#c8e6c9
    style Education fill:#ffccbc
    style Projects fill:#b3e5fc
    style Skills fill:#f8bbd0
```

## CRUD Operation Pattern

```mermaid
stateDiagram-v2
    [*] --> List: Navigate to entity

    List --> View: Click item
    List --> Create: Click create button
    List --> Delete: Click delete button

    Create --> Form: Initialize empty form
    Form --> Validate: Submit
    Validate --> Error: Invalid
    Validate --> Save: Valid
    Error --> Form: Show errors
    Save --> API: Mutation
    API --> Success: Created
    API --> Error: Failed
    Success --> List: Redirect

    View --> Edit: Click edit button
    Edit --> Form2: Load existing data
    Form2 --> Validate2: Submit
    Validate2 --> Error2: Invalid
    Validate2 --> Update: Valid
    Error2 --> Form2: Show errors
    Update --> API2: Mutation
    API2 --> Success2: Updated
    API2 --> Error2: Failed
    Success2 --> List: Redirect

    Delete --> Confirm: Show dialog
    Confirm --> List: Cancel
    Confirm --> API3: Confirm
    API3 --> Success3: Deleted
    API3 --> Error3: Failed
    Success3 --> List: Refresh
    Error3 --> List: Show error

    List --> [*]: Navigate away
```

## Component Reusability

```mermaid
graph TB
    subgraph Pages["Page Components"]
        CvPage[CV Pages]
        CompanyPage[Company Pages]
        EducationPage[Education Pages]
        ProjectPage[Project Pages]
        SkillPage[Skill Pages]
    end

    subgraph Forms["Form Components"]
        CvForm[CV Form]
        CompanyForm[Company Form]
        EducationForm[Education Form]
        ProjectForm[Project Form]
        SkillForm[Skill Form]
    end

    subgraph UI["UI Components"]
        Button[Button]
        Input[Input]
        Select[Select]
        TextArea[TextArea]
        Card[Card]
        Table[Table]
        Modal[Modal]
    end

    subgraph Layout["Layout Components"]
        Header[Header]
        Nav[Navigation]
        Footer[Footer]
    end

    CvPage --> CvForm
    CompanyPage --> CompanyForm
    EducationPage --> EducationForm
    ProjectPage --> ProjectForm
    SkillPage --> SkillForm

    CvForm --> Button
    CvForm --> Input
    CompanyForm --> Button
    CompanyForm --> Input
    CompanyForm --> TextArea
    EducationForm --> Button
    EducationForm --> Input
    EducationForm --> TextArea
    ProjectForm --> Button
    ProjectForm --> Input
    ProjectForm --> TextArea
    SkillForm --> Button
    SkillForm --> Input
    SkillForm --> Select

    CvPage --> Table
    CompanyPage --> Table
    EducationPage --> Table
    ProjectPage --> Table
    SkillPage --> Table

    CvPage --> Card
    CompanyPage --> Card

    CvPage --> Modal
    CompanyPage --> Modal

    CvPage --> Header
    CvPage --> Nav
    CompanyPage --> Header
    CompanyPage --> Nav

    style UI fill:#e1f5ff
    style Forms fill:#fff9c4
    style Pages fill:#c8e6c9
    style Layout fill:#ffccbc
```

## Deployment Architecture with Aspire

```mermaid
graph TB
    subgraph Aspire["Aspire AppHost"]
        Host[Mind.AppHost]
    end

    subgraph Containers["Container Orchestration"]
        ClientContainer[mind-client:5173]
        ApiContainer[mind-api:8080]
        PostgresContainer[postgres:5432]
        AdminerContainer[adminer:8080]
    end

    subgraph Network["Internal Network"]
        DNS[Service Discovery]
    end

    Host -->|Configures| ClientContainer
    Host -->|Configures| ApiContainer
    Host -->|Configures| PostgresContainer
    Host -->|Configures| AdminerContainer

    ClientContainer -.->|HTTP| DNS
    ApiContainer -.->|GraphQL| DNS
    PostgresContainer -.->|SQL| DNS

    DNS -->|Resolves| ApiContainer
    DNS -->|Resolves| PostgresContainer

    ClientContainer -->|API Calls| ApiContainer
    ApiContainer -->|Queries| PostgresContainer
    AdminerContainer -->|Manage| PostgresContainer

    style Aspire fill:#e1bee7
    style Containers fill:#c8e6c9
    style Network fill:#b3e5fc
```
