using GraphQL;
using GraphQL.Types;
using Mind.Presentation.GraphQL.Inputs;
using Mind.Presentation.GraphQL.Types;
using Mind.Application.Inputs;
using Mind.Application.Services;
using Microsoft.Extensions.DependencyInjection;

namespace Mind.Presentation.GraphQL.Mutations;

internal static class SkillMutations
{
    public static void AddSkillMutations(this ObjectGraphType root)
    {
        root.Field<NonNullGraphType<SkillType>>("createSkill")
            .Argument<NonNullGraphType<SkillsCreateInputType>>("input")
            .ResolveAsync(async context =>
            {
                var services = context.RequestServices ?? throw new InvalidOperationException("RequestServices is not available.");
                var input = context.GetArgument<SkillCreateInput>("input");
                return await services.GetRequiredService<ISkillService>().CreateAsync(input, context.CancellationToken);
            });

        root.Field<NonNullGraphType<SkillType>>("updateSkill")
            .Argument<NonNullGraphType<SkillUpsertInputType>>("input")
            .ResolveAsync(async context =>
            {
                var services = context.RequestServices ?? throw new InvalidOperationException("RequestServices is not available.");
                var input = context.GetArgument<SkillUpsertInput>("input");
                return await services.GetRequiredService<ISkillService>().UpdateAsync(input, context.CancellationToken);
            });

        root.Field<NonNullGraphType<BooleanGraphType>>("deleteSkill")
            .Argument<NonNullGraphType<IdGraphType>>("id")
            .ResolveAsync(async context =>
            {
                var services = context.RequestServices ?? throw new InvalidOperationException("RequestServices is not available.");
                var id = context.GetArgument<Guid>("id");
                return await services.GetRequiredService<ISkillService>().DeleteAsync(id, context.CancellationToken);
            });
    }
}
