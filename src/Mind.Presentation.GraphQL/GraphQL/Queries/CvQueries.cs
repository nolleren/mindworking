using GraphQL;
using GraphQL.Types;
using Mind.Presentation.GraphQL.Types;
using Mind.Application.Services;

namespace Mind.Presentation.GraphQL.Queries;

internal static class CvQueries
{
    public static void AddCvQueries(this ObjectGraphType root)
    {
        root.Field<ListGraphType<NonNullGraphType<CvType>>>("cvs")
            .ResolveAsync(async context =>
            {
                var services = context.RequestServices ?? throw new InvalidOperationException("RequestServices is not available.");
                return await services.GetRequiredService<ICvService>().GetAllAsync(context.CancellationToken);
            });

        root.Field<CvType>("cv")
            .Argument<NonNullGraphType<IdGraphType>>("id")
            .ResolveAsync(async context =>
            {
                var services = context.RequestServices ?? throw new InvalidOperationException("RequestServices is not available.");
                var id = context.GetArgument<Guid>("id");
                return await services.GetRequiredService<ICvService>().GetByIdAsync(id, context.CancellationToken);
            });
    }
}
