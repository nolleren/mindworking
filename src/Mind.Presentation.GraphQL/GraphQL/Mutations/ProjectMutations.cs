using GraphQL;
using GraphQL.Types;
using Mind.Presentation.GraphQL.Inputs;
using Mind.Presentation.GraphQL.Types;
using Mind.Application.Inputs;
using Mind.Application.Services;

namespace Mind.Presentation.GraphQL.Mutations;

internal static class ProjectMutations
{
    public static void AddProjectMutations(this ObjectGraphType root)
    {
        root.Field<NonNullGraphType<ProjectType>>("createProject")
            .Argument<NonNullGraphType<ProjectCreateInputType>>("input")
            .ResolveAsync(async context =>
            {
                var services = context.RequestServices ?? throw new InvalidOperationException("RequestServices is not available.");
                var input = context.GetArgument<ProjectCreateInput>("input");
                return await services.GetRequiredService<IProjectService>().CreateAsync(input, context.CancellationToken);
            });

        root.Field<NonNullGraphType<ProjectType>>("updateProject")
            .Argument<NonNullGraphType<ProjectUpsertInputType>>("input")
            .ResolveAsync(async context =>
            {
                var services = context.RequestServices ?? throw new InvalidOperationException("RequestServices is not available.");
                var input = context.GetArgument<ProjectUpsertInput>("input");
                return await services.GetRequiredService<IProjectService>().UpdateAsync(input, context.CancellationToken);
            });

        root.Field<NonNullGraphType<BooleanGraphType>>("deleteProject")
            .Argument<NonNullGraphType<IdGraphType>>("id")
            .ResolveAsync(async context =>
            {
                var services = context.RequestServices ?? throw new InvalidOperationException("RequestServices is not available.");
                var id = context.GetArgument<Guid>("id");
                return await services.GetRequiredService<IProjectService>().DeleteAsync(id, context.CancellationToken);
            });
    }
}
