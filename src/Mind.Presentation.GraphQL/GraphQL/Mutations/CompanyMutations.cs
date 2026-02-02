using GraphQL;
using GraphQL.Types;
using Mind.Presentation.GraphQL.Inputs;
using Mind.Presentation.GraphQL.Types;
using Mind.Application.Inputs;
using Mind.Application.Services;

namespace Mind.Presentation.GraphQL.Mutations;

internal static class CompanyMutations
{
    public static void AddCompanyMutations(this ObjectGraphType root)
    {
        root.Field<NonNullGraphType<CompanyType>>("createCompany")
            .Argument<NonNullGraphType<CompanyCreateInputType>>("input")
            .ResolveAsync(async context =>
            {
                var services = context.RequestServices ?? throw new InvalidOperationException("RequestServices is not available.");
                var input = context.GetArgument<CompanyCreateInput>("input");
                return await services.GetRequiredService<ICompanyService>().CreateAsync(input, context.CancellationToken);
            });

        root.Field<NonNullGraphType<CompanyType>>("updateCompany")
            .Argument<NonNullGraphType<CompanyUpsertInputType>>("input")
            .ResolveAsync(async context =>
            {
                var services = context.RequestServices ?? throw new InvalidOperationException("RequestServices is not available.");
                var input = context.GetArgument<CompanyUpsertInput>("input");
                return await services.GetRequiredService<ICompanyService>().UpdateAsync(input, context.CancellationToken);
            });

        root.Field<NonNullGraphType<BooleanGraphType>>("deleteCompany")
            .Argument<NonNullGraphType<IdGraphType>>("id")
            .ResolveAsync(async context =>
            {
                var services = context.RequestServices ?? throw new InvalidOperationException("RequestServices is not available.");
                var id = context.GetArgument<Guid>("id");
                return await services.GetRequiredService<ICompanyService>().DeleteAsync(id, context.CancellationToken);
            });
    }
}
