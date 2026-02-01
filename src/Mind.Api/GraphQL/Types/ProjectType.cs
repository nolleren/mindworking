using GraphQL;
using GraphQL.Types;
using Mind.Api.GraphQL.DataLoaders;
using Mind.Core.Entities;

namespace Mind.Api.GraphQL.Types;

public sealed class ProjectType : ObjectGraphType<Project>
{
    public ProjectType()
    {
        Name = "Project";
        Interface<BaseEntityInterface>();

        Field(x => x.Id, type: typeof(NonNullGraphType<IdGraphType>));
        Field(x => x.Name);
        Field(x => x.StartDate, type: typeof(DateTimeGraphType));
        Field(x => x.EndDate, type: typeof(DateTimeGraphType));
        Field(x => x.Description, nullable: true);
        Field(x => x.CreatedAt, type: typeof(NonNullGraphType<DateTimeGraphType>));
        Field(x => x.UpdatedAt, type: typeof(NonNullGraphType<DateTimeGraphType>));

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
