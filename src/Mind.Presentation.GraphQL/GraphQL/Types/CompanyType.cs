using GraphQL.Types;
using Mind.Presentation.GraphQL.DataLoaders;
using Mind.Core.Entities;
using Microsoft.Extensions.DependencyInjection;

namespace Mind.Presentation.GraphQL.Types;

public sealed class CompanyType : ObjectGraphType<Company>
{
    public CompanyType()
    {
        Name = "Company";

        Field(x => x.Id, type: typeof(NonNullGraphType<IdGraphType>));
        Field(x => x.Name);
        Field(x => x.Address, nullable: true);
        Field(x => x.ZipCode, nullable: true);
        Field(x => x.City, nullable: true);
        Field(x => x.Description, nullable: true);
        Field(x => x.CreatedAt, type: typeof(NonNullGraphType<DateTimeGraphType>));
        Field(x => x.UpdatedAt, type: typeof(NonNullGraphType<DateTimeGraphType>));

        Field<NonNullGraphType<BooleanGraphType>>("canDelete")
            .ResolveAsync(async context =>
            {
                var services = context.RequestServices ?? throw new InvalidOperationException("RequestServices is not available.");
                var cvs = await services
                    .GetRequiredService<CvsByEntityIdDataLoader<Company>>()
                    .LoadAsync(context.Source.Id)
                    .GetResultAsync();

                return cvs.Count == 0;
            });

        Field<ListGraphType<NonNullGraphType<CvType>>>("cvs")
            .Resolve(context =>
            {
                var services = context.RequestServices ?? throw new InvalidOperationException("RequestServices is not available.");
                return services
                    .GetRequiredService<CvsByEntityIdDataLoader<Company>>()
                    .LoadAsync(context.Source.Id);
            });
    }
}
