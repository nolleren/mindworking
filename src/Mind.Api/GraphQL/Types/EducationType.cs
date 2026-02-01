using GraphQL;
using GraphQL.Types;
using Mind.Api.GraphQL.DataLoaders;
using Mind.Core.Entities;

namespace Mind.Api.GraphQL.Types;

public sealed class EducationType : ObjectGraphType<Education>
{
    public EducationType()
    {
        Name = "Education";
        Interface<BaseEntityInterface>();

        Field(x => x.Id, type: typeof(NonNullGraphType<IdGraphType>));
        Field(x => x.Name);
        Field(x => x.Address, nullable: true);
        Field(x => x.ZipCode, nullable: true);
        Field(x => x.City, nullable: true);
        Field(x => x.Description, nullable: true);
        Field(x => x.CreatedAt, type: typeof(NonNullGraphType<DateTimeGraphType>));
        Field(x => x.UpdatedAt, type: typeof(NonNullGraphType<DateTimeGraphType>));

        Field<ListGraphType<NonNullGraphType<CvType>>>("cvs")
            .Resolve(context =>
            {
                var services = context.RequestServices ?? throw new InvalidOperationException("RequestServices is not available.");
                return services
                    .GetRequiredService<CvsByEntityIdDataLoader<Education>>()
                    .LoadAsync(context.Source.Id);
            });
    }
}
