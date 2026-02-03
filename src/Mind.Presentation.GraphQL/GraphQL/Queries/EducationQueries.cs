using GraphQL;
using GraphQL.Types;
using Mind.Presentation.GraphQL.Types;
using Mind.Application.Services;
using Microsoft.Extensions.DependencyInjection;

namespace Mind.Presentation.GraphQL.Queries;

internal static class EducationQueries
{
    public static void AddEducationQueries(this ObjectGraphType root)
    {
        root.Field<NonNullGraphType<ListGraphType<NonNullGraphType<EducationType>>>>("educations")
            .ResolveAsync(async context =>
            {
                var services = context.RequestServices ?? throw new InvalidOperationException("RequestServices is not available.");
                return await services.GetRequiredService<IEducationService>().GetAllAsync(context.CancellationToken);
            });

        root.Field<EducationType>("education")
            .Argument<NonNullGraphType<IdGraphType>>("id")
            .ResolveAsync(async context =>
            {
                var services = context.RequestServices ?? throw new InvalidOperationException("RequestServices is not available.");
                var id = context.GetArgument<Guid>("id");
                return await services.GetRequiredService<IEducationService>().GetByIdAsync(id, context.CancellationToken);
            });
    }
}
