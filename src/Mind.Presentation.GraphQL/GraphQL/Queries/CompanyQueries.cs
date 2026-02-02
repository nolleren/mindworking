using GraphQL;
using GraphQL.Types;
using Mind.Presentation.GraphQL.Types;
using Mind.Application.Services;

namespace Mind.Presentation.GraphQL.Queries;

internal static class CompanyQueries
{
    public static void AddCompanyQueries(this ObjectGraphType root)
    {
        root.Field<ListGraphType<NonNullGraphType<CompanyType>>>("companies")
            .ResolveAsync(async context =>
            {
                var services = context.RequestServices ?? throw new InvalidOperationException("RequestServices is not available.");
                return await services.GetRequiredService<ICompanyService>().GetAllAsync(context.CancellationToken);
            });

        root.Field<CompanyType>("company")
            .Argument<NonNullGraphType<IdGraphType>>("id")
            .ResolveAsync(async context =>
            {
                var services = context.RequestServices ?? throw new InvalidOperationException("RequestServices is not available.");
                var id = context.GetArgument<Guid>("id");
                return await services.GetRequiredService<ICompanyService>().GetByIdAsync(id, context.CancellationToken);
            });
    }
}
