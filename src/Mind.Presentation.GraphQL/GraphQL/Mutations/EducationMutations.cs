using GraphQL;
using GraphQL.Types;
using Mind.Presentation.GraphQL.Inputs;
using Mind.Presentation.GraphQL.Types;
using Mind.Application.Inputs;
using Mind.Application.Services;
using Microsoft.Extensions.DependencyInjection;

namespace Mind.Presentation.GraphQL.Mutations;

internal static class EducationMutations
{
    public static void AddEducationMutations(this ObjectGraphType root)
    {
        root.Field<NonNullGraphType<EducationType>>("createEducation")
            .Argument<NonNullGraphType<EducationCreateInputType>>("input")
            .ResolveAsync(async context =>
            {
                var services = context.RequestServices ?? throw new InvalidOperationException("RequestServices is not available.");
                var input = context.GetArgument<EducationCreateInput>("input");
                return await services.GetRequiredService<IEducationService>().CreateAsync(input, context.CancellationToken);
            });

        root.Field<NonNullGraphType<EducationType>>("updateEducation")
            .Argument<NonNullGraphType<EducationUpsertInputType>>("input")
            .ResolveAsync(async context =>
            {
                var services = context.RequestServices ?? throw new InvalidOperationException("RequestServices is not available.");
                var input = context.GetArgument<EducationUpsertInput>("input");
                return await services.GetRequiredService<IEducationService>().UpdateAsync(input, context.CancellationToken);
            });

        root.Field<NonNullGraphType<BooleanGraphType>>("deleteEducation")
            .Argument<NonNullGraphType<IdGraphType>>("id")
            .ResolveAsync(async context =>
            {
                var services = context.RequestServices ?? throw new InvalidOperationException("RequestServices is not available.");
                var id = context.GetArgument<Guid>("id");
                return await services.GetRequiredService<IEducationService>().DeleteAsync(id, context.CancellationToken);
            });
    }
}
