import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  // Schema URL - peger på din GraphQL API
  schema: 'http://localhost:5097/graphql',

  // Hvor dine GraphQL operations ligger (.graphql eller .ts/.tsx filer)
  // Vigtigt: udeluk genererede filer, ellers får vi dublerede operation-navne
  documents: [
    'src/graphql/operations/**/*.graphql',
    'src/**/*.{ts,tsx}',
    '!src/graphql/generated/**',
  ],

  // Hvor de genererede filer skal placeres
  generates: {
    './src/graphql/generated/types.ts': {
      plugins: ['typescript', 'typescript-operations', 'typescript-react-apollo'],
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
        // maybeValue: 'T | null | undefined',
        // Gør alle felter optional som default
        // avoidOptionals: {
        //   field: false,
        //   inputValue: false,
        //   object: false,
        // },
        scalars: {
          DateTime: 'string',
          Date: 'string',
          UUID: 'string',
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
