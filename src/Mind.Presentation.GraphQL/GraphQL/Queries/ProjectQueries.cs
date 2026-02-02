using GraphQL;
using GraphQL.Types;
using Mind.Presentation.GraphQL.Types;
using Mind.Application.Services;

namespace Mind.Presentation.GraphQL.Queries;

internal static class ProjectQueries
{
    public static void AddProjectQueries(this ObjectGraphType root)
    {
        root.Field<ListGraphType<NonNullGraphType<ProjectType>>>("projects")
            .ResolveAsync(async context =>
            {
                var services = context.RequestServices ?? throw new InvalidOperationException("RequestServices is not available.");
                return await services.GetRequiredService<IProjectService>().GetAllAsync(context.CancellationToken);
            });

        root.Field<ProjectType>("project")
            .Argument<NonNullGraphType<IdGraphType>>("id")
            .ResolveAsync(async context =>
            {
                var services = context.RequestServices ?? throw new InvalidOperationException("RequestServices is not available.");
                var id = context.GetArgument<Guid>("id");
                return await services.GetRequiredService<IProjectService>().GetByIdAsync(id, context.CancellationToken);
            });
    }
}
