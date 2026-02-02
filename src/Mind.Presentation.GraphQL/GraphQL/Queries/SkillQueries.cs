using GraphQL;
using GraphQL.Types;
using Mind.Presentation.GraphQL.Types;
using Mind.Application.Services;

namespace Mind.Presentation.GraphQL.Queries;

internal static class SkillQueries
{
    public static void AddSkillQueries(this ObjectGraphType root)
    {
        root.Field<ListGraphType<NonNullGraphType<SkillType>>>("skills")
            .ResolveAsync(async context =>
            {
                var services = context.RequestServices ?? throw new InvalidOperationException("RequestServices is not available.");
                return await services.GetRequiredService<ISkillService>().GetAllAsync(context.CancellationToken);
            });

        root.Field<SkillType>("skill")
            .Argument<NonNullGraphType<IdGraphType>>("id")
            .ResolveAsync(async context =>
            {
                var services = context.RequestServices ?? throw new InvalidOperationException("RequestServices is not available.");
                var id = context.GetArgument<Guid>("id");
                return await services.GetRequiredService<ISkillService>().GetByIdAsync(id, context.CancellationToken);
            });
    }
}
