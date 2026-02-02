import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const typesPath = path.join(__dirname, 'src/graphql/generated/types.ts');

// Apollo Client v4 splits React exports into `@apollo/client/react`.
// GraphQL codegen (typescript-react-apollo) still emits `import * as Apollo from '@apollo/client'`
// and uses types that were removed/moved in v4. This script patches the generated file after codegen.

const APOLLO_CORE_SOURCE = '@apollo/client';
const APOLLO_REACT_SOURCE = '@apollo/client/react';

const HOOK_FUNCTIONS = [
  'useQuery',
  'useLazyQuery',
  'useMutation',
  'useSubscription',
  'useSuspenseQuery',
];

const OPTION_TYPES = [
  'QueryHookOptions',
  'LazyQueryHookOptions',
  'MutationHookOptions',
  'SubscriptionHookOptions',
  'SuspenseQueryHookOptions',
  'UseSuspenseQueryResult',
  'QueryResult',
  'MutationResult',
  'MutationTuple',
];

function rewriteDeprecatedApolloReactTypeAliases(content) {
  // Apollo v4 moved the public, non-deprecated hook types under namespaces on
  // each hook function (e.g. `useQuery.Options`, `useMutation.ResultTuple`).
  // The `@apollo/client/react` entrypoint re-exports legacy aliases from
  // `./types/deprecated.js`, which TypeScript surfaces as @deprecated.

  // Queries
  content = content.replace(/\bApollo\.QueryHookOptions\s*</g, 'Apollo.useQuery.Options<');
  content = content.replace(/\bApollo\.QueryResult\s*</g, 'Apollo.useQuery.Result<');

  // Lazy queries
  content = content.replace(/\bApollo\.LazyQueryHookOptions\s*</g, 'Apollo.useLazyQuery.Options<');
  content = content.replace(/\bApollo\.LazyQueryResult\s*</g, 'Apollo.useLazyQuery.Result<');
  content = content.replace(
    /\bApollo\.LazyQueryResultTuple\s*</g,
    'Apollo.useLazyQuery.ResultTuple<'
  );
  content = content.replace(
    /\bApollo\.LazyQueryHookExecOptions\s*</g,
    'Apollo.useLazyQuery.ExecOptions<'
  );
  content = content.replace(
    /\bApollo\.LazyQueryExecFunction\s*</g,
    'Apollo.useLazyQuery.ExecFunction<'
  );

  // Mutations
  content = content.replace(/\bApollo\.MutationHookOptions\s*</g, 'Apollo.useMutation.Options<');
  content = content.replace(/\bApollo\.MutationResult\s*</g, 'Apollo.useMutation.Result<');

  // Prefer the dedicated mutation function type over tuple indexing.
  content = content.replace(
    /Apollo\.MutationTuple\s*<\s*([^,>\s]+)\s*,\s*([^>\s]+)\s*>\s*\[0\]/g,
    'Apollo.useMutation.MutationFunction<$1, $2>'
  );
  content = content.replace(
    /\bApollo\.MutationTuple\s*<\s*([^,>\s]+)\s*,\s*([^>\s]+)\s*>/g,
    'Apollo.useMutation.ResultTuple<$1, $2>'
  );

  // Subscriptions
  content = content.replace(
    /\bApollo\.SubscriptionHookOptions\s*</g,
    'Apollo.useSubscription.Options<'
  );
  content = content.replace(/\bApollo\.SubscriptionResult\s*</g, 'Apollo.useSubscription.Result<');

  // Suspense queries: legacy alias carried both data + variables, but the new
  // `useSuspenseQuery.Options` only cares about variables.
  content = content.replace(
    /Apollo\.SuspenseQueryHookOptions\s*<\s*([^,>]+)\s*,\s*([^>]+)\s*>/g,
    'Apollo.useSuspenseQuery.Options<$2>'
  );
  content = content.replace(
    /Apollo\.UseSuspenseQueryResult\s*<\s*([^,>]+)\s*,\s*([^>]+)\s*>/g,
    'Apollo.useSuspenseQuery.Result<$1, $2>'
  );

  return content;
}

function normalizeEol(text) {
  // Preserve existing line endings (default to \n).
  return text.includes('\r\n') ? '\r\n' : '\n';
}

function removeImportLines(content, eol, source) {
  // Remove any single-line imports from the given source.
  const sourceEscaped = source.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
  const regex = new RegExp(`^import\\s+.*\\s+from\\s+['\"]${sourceEscaped}['\"];\\s*${eol}?`, 'gm');
  return content.replace(regex, '');
}

function cleanupBlankLines(content, eol) {
  // Avoid giant whitespace blocks when imports are removed.
  content = content.replace(new RegExp(`${eol}{3,}`, 'g'), eol + eol);
  // Trim a leading blank line if we created one.
  content = content.replace(new RegExp(`^${eol}+`), '');
  return content;
}

function rewriteApolloNamespaceImport(content) {
  // Prefer Apollo namespace from the React entrypoint in v4.
  content = content.replace(
    /^import\s+\*\s+as\s+Apollo\s+from\s+['\"]@apollo\/client['\"];\s*$/m,
    `import * as Apollo from '${APOLLO_REACT_SOURCE}';`
  );

  // If we previously swapped to a different Apollo namespace, normalize it.
  content = content.replace(
    /^import\s+\*\s+as\s+Apollo\s+from\s+['\"]@apollo\/client\/react['\"];\s*$/m,
    `import * as Apollo from '${APOLLO_REACT_SOURCE}';`
  );

  return content;
}

function rewriteUnqualifiedHooksAndTypesToApollo(content) {
  // If earlier fixes made direct hook calls/types, normalize back to Apollo.* so
  // we don't need fragile per-symbol imports (avoids unused-import errors).
  const hookCallRegex = (name) => new RegExp(`(?<!Apollo\\.)\\b${name}(?=\\s*(?:<|\\())`, 'g');
  for (const fn of HOOK_FUNCTIONS) {
    content = content.replace(hookCallRegex(fn), `Apollo.${fn}`);
  }

  // Option/result types
  for (const typeName of OPTION_TYPES) {
    const typeRegex = new RegExp(`(?<!Apollo\\.)\\b${typeName}\\b(?=\\s*<)`, 'g');
    content = content.replace(typeRegex, `Apollo.${typeName}`);
  }

  // SkipToken / skipToken (used in SuspenseQuery overloads)
  content = content.replace(/(?<!Apollo\.)\bSkipToken\b/g, 'Apollo.SkipToken');
  content = content.replace(/(?<!Apollo\.)\bskipToken\b/g, 'Apollo.skipToken');

  return content;
}

function rewriteMissingApolloV4Symbols(content) {
  // Apollo Client v4 removed BaseMutationOptions and MutationFunction exports.
  // codegen still emits these symbols; map them to v4 equivalents.

  // If an earlier version of this fixer introduced a double namespace (Apollo.Apollo.*), normalize it.
  content = content.replace(/\bApollo\.Apollo\./g, 'Apollo.');

  content = rewriteSuspenseQueryHooks(content);

  // `Apollo.MutationFunction<TData, TVariables>` -> `Apollo.useMutation.MutationFunction<TData, TVariables>`
  content = content.replace(
    /Apollo\.MutationFunction\s*<\s*([^,>\s]+)\s*,\s*([^>\s]+)\s*>/g,
    'Apollo.useMutation.MutationFunction<$1, $2>'
  );

  // `Apollo.BaseMutationOptions<TData, TVariables>` -> `Apollo.useMutation.Options<TData, TVariables>`
  content = content.replace(
    /Apollo\.BaseMutationOptions\s*<\s*([^,>\s]+)\s*,\s*([^>\s]+)\s*>/g,
    'Apollo.useMutation.Options<$1, $2>'
  );

  return content;
}

function getEmptyVariablesTypeNames(content) {
  // Example from codegen:
  // export type GetCompaniesQueryVariables = Exact<{ [key: string]: never; }>;
  const empty = new Set();
  const regex = /export type (\w+)\s*=\s*Exact<\{\s*\[key:\s*string\]\s*:\s*never;\s*\}\s*>\s*;?/g;

  let match;
  while ((match = regex.exec(content)) !== null) {
    empty.add(match[1]);
  }
  return empty;
}

function rewriteSuspenseQueryHooks(content) {
  const eol = normalizeEol(content);
  const emptyVariables = getEmptyVariablesTypeNames(content);

  const lines = content.split(eol);
  const out = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Remove the two overload signature lines (and optional preceding // @ts-ignore)
    // generated by codegen for SuspenseQuery hooks.
    // We will keep only the implementation and type it properly for Apollo v4.
    if (line.trim() === '// @ts-ignore') {
      const l1 = lines[i + 1] ?? '';
      const l2 = lines[i + 2] ?? '';
      const l3 = lines[i + 3] ?? '';

      const name1 = l1.match(/^export function (use\w+SuspenseQuery)\(/)?.[1];
      if (
        name1 &&
        l2.includes(`export function ${name1}(`) &&
        l1.trim().endsWith(';') &&
        l2.trim().endsWith(';') &&
        l3.startsWith(`export function ${name1}(`) &&
        l3.includes('{')
      ) {
        // Skip ts-ignore and the two overload signatures.
        i += 2;
        continue;
      }
    }

    // Also handle the case where overloads exist but without the ts-ignore line.
    if (
      line.startsWith('export function use') &&
      line.includes('SuspenseQuery') &&
      line.trim().endsWith(';')
    ) {
      const name1 = line.match(/^export function (use\w+SuspenseQuery)\(/)?.[1];
      const l2 = lines[i + 1] ?? '';
      const l3 = lines[i + 2] ?? '';
      if (
        name1 &&
        l2.includes(`export function ${name1}(`) &&
        l2.trim().endsWith(';') &&
        l3.startsWith(`export function ${name1}(`) &&
        l3.includes('{')
      ) {
        // Skip both overload lines.
        i += 1;
        continue;
      }
    }

    // Rewrite the implementation signature/body.
    const implMatch = line.match(/^export function (use\w+SuspenseQuery)\((.*)\)\s*\{\s*$/);
    if (implMatch) {
      const fnName = implMatch[1];

      // Scan forward inside the function for the useSuspenseQuery call so we can extract generic args.
      let j = i + 1;
      let dataType = null;
      let variablesType = null;

      while (
        j < lines.length &&
        !lines[j].startsWith('export ') &&
        !lines[j].startsWith('export const ') &&
        !lines[j].startsWith('export type ')
      ) {
        const returnMatch = lines[j].match(
          /return\s+Apollo\.useSuspenseQuery<([^,>]+),\s*([^>]+)>\(/
        );
        if (returnMatch) {
          dataType = returnMatch[1].trim();
          variablesType = returnMatch[2].trim();
          break;
        }
        j++;
      }

      if (!dataType || !variablesType) {
        out.push(line);
        continue;
      }

      const isEmpty = emptyVariables.has(variablesType);
      const paramOptional = isEmpty;
      const param = `${paramOptional ? 'baseOptions?:' : 'baseOptions:'} Apollo.SkipToken | Apollo.useSuspenseQuery.Options<${variablesType}>`;
      out.push(`export function ${fnName}(${param}) {`);

      // Copy the body lines but patch the options line and remove `as any` casts.
      i += 1;
      for (; i < lines.length; i++) {
        const bodyLine = lines[i];

        // End of function
        if (bodyLine.trim() === '}') {
          out.push(bodyLine);
          break;
        }

        // Rewrite `const options = ...` line.
        if (
          bodyLine.includes('const options =') &&
          bodyLine.includes('baseOptions === Apollo.skipToken')
        ) {
          if (paramOptional) {
            out.push(
              bodyLine.replace(
                /const options = baseOptions === Apollo\.skipToken \? baseOptions : \{\.\.\.defaultOptions, \.\.\.baseOptions\}/,
                'const options: Apollo.SkipToken | Apollo.useSuspenseQuery.Options<' +
                  variablesType +
                  '> = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...(baseOptions ?? {})}'
              )
            );
            continue;
          }

          out.push(
            bodyLine.replace(
              /const options = baseOptions === Apollo\.skipToken \? baseOptions : \{\.\.\.defaultOptions, \.\.\.baseOptions\}/,
              `const options: Apollo.SkipToken | Apollo.useSuspenseQuery.Options<${variablesType}> = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}`
            )
          );
          continue;
        }

        // Remove `options as any`.
        if (bodyLine.includes('options as any')) {
          out.push(bodyLine.replace(/options\s+as\s+any/g, 'options'));
          continue;
        }

        // If we had previously changed the signature to `baseOptions?: any`, normalize options-building.
        if (bodyLine.includes('const options =') && bodyLine.includes('...(baseOptions')) {
          // leave as-is
          out.push(bodyLine);
          continue;
        }

        out.push(bodyLine);
      }

      continue;
    }

    out.push(line);
  }

  return out.join(eol);
}

if (fs.existsSync(typesPath)) {
  let content = fs.readFileSync(typesPath, 'utf8');

  const eol = normalizeEol(content);

  // Normalize imports and symbols for Apollo v4.
  content = rewriteApolloNamespaceImport(content);

  // Remove fragile per-symbol imports introduced by earlier fixers (or manual tweaks).
  content = removeImportLines(content, eol, '@apollo/client/react/hooks');
  content = removeImportLines(content, eol, '@apollo/client/react/types/deprecated');

  // If hooks/types were imported directly from '@apollo/client', we don't want them either.
  // (We'll keep only gql + Apollo namespace.)
  // This is safe because we normalize all calls/types back to Apollo.* below.
  if (
    content.includes(`from '${APOLLO_CORE_SOURCE}'`) ||
    content.includes(`from "${APOLLO_CORE_SOURCE}"`)
  ) {
    // Remove only the specific named import line if it exists.
    content = content.replace(
      /^import\s+\{[^}]*\b(useQuery|useLazyQuery|useMutation|useSubscription|useSuspenseQuery|QueryHookOptions|LazyQueryHookOptions|MutationHookOptions|SubscriptionHookOptions|SuspenseQueryHookOptions)\b[^}]*\}\s+from\s+['\"]@apollo\/client['\"];\s*$/gm,
      ''
    );
  }

  content = rewriteUnqualifiedHooksAndTypesToApollo(content);
  content = rewriteMissingApolloV4Symbols(content);
  content = rewriteDeprecatedApolloReactTypeAliases(content);
  content = cleanupBlankLines(content, eol);

  const before = fs.readFileSync(typesPath, 'utf8');
  if (content !== before) {
    fs.writeFileSync(typesPath, content);
    console.log('Fixed types.ts');
  } else {
    console.log('types.ts already clean');
  }
} else {
  console.error('types.ts not found');
}
