using GraphQL;
using GraphQL.Types;
using Mind.Presentation.GraphQL.Inputs;
using Mind.Presentation.GraphQL.Types;
using Mind.Application.Inputs;
using Mind.Application.Services;
using Microsoft.Extensions.DependencyInjection;

namespace Mind.Presentation.GraphQL.Mutations;

internal static class CvMutations
{
    public static void AddCvMutations(this ObjectGraphType root)
    {
        root.Field<NonNullGraphType<CvType>>("createCv")
            .Argument<NonNullGraphType<CvCreateInputType>>("input")
            .ResolveAsync(async context =>
            {
                var services = context.RequestServices ?? throw new InvalidOperationException("RequestServices is not available.");
                var input = context.GetArgument<CvCreateInput>("input");

                return await services.GetRequiredService<ICvService>().CreateAsync(input, context.CancellationToken);
            });

        root.Field<NonNullGraphType<CvType>>("updateCv")
            .Argument<NonNullGraphType<CvUpdateInputType>>("input")
            .ResolveAsync(async context =>
            {
                var services = context.RequestServices ?? throw new InvalidOperationException("RequestServices is not available.");
                var input = context.GetArgument<CvUpdateInput>("input");

                return await services.GetRequiredService<ICvService>().UpdateAsync(input, context.CancellationToken);
            });

        root.Field<NonNullGraphType<BooleanGraphType>>("deleteCv")
            .Argument<NonNullGraphType<IdGraphType>>("id")
            .ResolveAsync(async context =>
            {
                var services = context.RequestServices ?? throw new InvalidOperationException("RequestServices is not available.");
                var id = context.GetArgument<Guid>("id");

                return await services.GetRequiredService<ICvService>().DeleteAsync(id, context.CancellationToken);
            });
    }
}
