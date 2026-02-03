using GraphQL.DataLoader;
using GraphQL.Types;
using Mind.Presentation.GraphQL.DataLoaders;
using Mind.Core.Entities;
using Microsoft.Extensions.DependencyInjection;

namespace Mind.Presentation.GraphQL.Types;

public sealed class ProjectType : ObjectGraphType<Project>
{
    public ProjectType()
    {
        Name = "Project";

        Field(x => x.Id, type: typeof(NonNullGraphType<IdGraphType>));
        Field(x => x.Name);
        Field(x => x.StartDate, type: typeof(DateTimeGraphType));
        Field(x => x.EndDate, type: typeof(DateTimeGraphType));
        Field(x => x.Description);
        Field(x => x.CreatedAt, type: typeof(NonNullGraphType<DateTimeGraphType>));
        Field(x => x.UpdatedAt, type: typeof(NonNullGraphType<DateTimeGraphType>));

        Field<NonNullGraphType<BooleanGraphType>>("canDelete")
            .ResolveAsync(async context =>
            {
                var services = context.RequestServices ?? throw new InvalidOperationException("RequestServices is not available.");
                var cvs = await services
                    .GetRequiredService<CvsByEntityIdDataLoader<Project>>()
                    .LoadAsync(context.Source.Id)
                    .GetResultAsync();

                return cvs.Count == 0;
            });

        Field<ListGraphType<NonNullGraphType<CvType>>>("cvs")
            .Resolve(context =>
            {
                var services = context.RequestServices ?? throw new InvalidOperationException("RequestServices is not available.");
                return services
                    .GetRequiredService<CvsByEntityIdDataLoader<Project>>()
                    .LoadAsync(context.Source.Id);
            });
    }
}
