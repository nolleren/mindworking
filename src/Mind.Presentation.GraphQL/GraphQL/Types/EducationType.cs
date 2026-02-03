using GraphQL.Types;
using Mind.Presentation.GraphQL.DataLoaders;
using Mind.Core.Entities;
using Microsoft.Extensions.DependencyInjection;

namespace Mind.Presentation.GraphQL.Types;

public sealed class EducationType : ObjectGraphType<Education>
{
    public EducationType()
    {
        Name = "Education";

        Field(x => x.Id, type: typeof(NonNullGraphType<IdGraphType>));
        Field(x => x.Name);
        Field(x => x.Address);
        Field(x => x.ZipCode);
        Field(x => x.City);
        Field(x => x.Description);
        Field(x => x.CreatedAt, type: typeof(NonNullGraphType<DateTimeGraphType>));
        Field(x => x.UpdatedAt, type: typeof(NonNullGraphType<DateTimeGraphType>));

        Field<NonNullGraphType<BooleanGraphType>>("canDelete")
            .ResolveAsync(async context =>
            {
                var services = context.RequestServices ?? throw new InvalidOperationException("RequestServices is not available.");
                var cvs = await services
                    .GetRequiredService<CvsByEntityIdDataLoader<Education>>()
                    .LoadAsync(context.Source.Id)
                    .GetResultAsync();

                return cvs.Count == 0;
            });

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
