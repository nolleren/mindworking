# Mindworking Solution

## Kom hurtigt i gang

### Krav

- .NET 10 SDK (eller nyere)
- Docker (for lokal PostgreSQL, hvis ikke du har en k�rende Postgres i forvejen)
- (Valgfrit) Aspire/AppHost for nem lokal udvikling

### Ops�tning

1. **Klon repoet**

   ```sh
   git clone https://github.com/nolleren/mindworking.git
   cd mindworking
   ```

2. **Start**
   - **Aspire/AppHost**:
     ```sh
     dotnet run --project src/Mind.AppHost
     ```

### Seeddata

- Ved f�rste opstart seedes automatisk 20 companies, 20 projects, 20 educations, 20 skills og 5 CV'er med blandede relationer, hvis databasen er tom.

### Projektstruktur

- `src/Mind.Api` � Web API/GraphQL entrypoint
- `src/Mind.Presentation.GraphQL` � GraphQL schema/types
- `src/Mind.Application` � Application layer (DTOs, services, interfaces)
- `src/Mind.Infrastructure` � EF Core, database, seeddata, services
- `src/Mind.Core` � Dom�nemodeller/entities
- `src/Mind.AppHost` � Aspire/AppHost (valgfrit, for nem lokal udvikling)

### Udvikling

- K�r tests, migreringer og API som normalt for .NET 10 l�sninger.
- Seeddata kan �ndres i `src/Mind.Infrastructure/Persistence/SeedDataHostedService.cs`.
