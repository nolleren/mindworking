using GraphQL.Types;
using Mind.Presentation.GraphQL.DataLoaders;
using Mind.Core.Entities;
using Microsoft.Extensions.DependencyInjection;

namespace Mind.Presentation.GraphQL.Types;

public sealed class CvType : ObjectGraphType<Cv>
{
    public CvType()
    {
        Name = "Cv";

        Field(x => x.Id, type: typeof(NonNullGraphType<IdGraphType>));
        Field(x => x.Name);
        Field(x => x.CreatedAt, type: typeof(NonNullGraphType<DateTimeGraphType>));
        Field(x => x.UpdatedAt, type: typeof(NonNullGraphType<DateTimeGraphType>));

        Field<ListGraphType<NonNullGraphType<CompanyType>>>("companies")
            .Resolve(context =>
            {
                var services = context.RequestServices ?? throw new InvalidOperationException("RequestServices is not available.");
                return services
                    .GetRequiredService<EntitiesByCvIdDataLoader<Company>>()
                    .LoadAsync(context.Source.Id);
            });

        Field<ListGraphType<NonNullGraphType<ProjectType>>>("projects")
            .Resolve(context =>
            {
                var services = context.RequestServices ?? throw new InvalidOperationException("RequestServices is not available.");
                return services
                    .GetRequiredService<EntitiesByCvIdDataLoader<Project>>()
                    .LoadAsync(context.Source.Id);
            });

        Field<ListGraphType<NonNullGraphType<EducationType>>>("educations")
            .Resolve(context =>
            {
                var services = context.RequestServices ?? throw new InvalidOperationException("RequestServices is not available.");
                return services
                    .GetRequiredService<EntitiesByCvIdDataLoader<Education>>()
                    .LoadAsync(context.Source.Id);
            });

        Field<ListGraphType<NonNullGraphType<SkillType>>>("skills")
            .Resolve(context =>
            {
                var services = context.RequestServices ?? throw new InvalidOperationException("RequestServices is not available.");
                return services
                    .GetRequiredService<EntitiesByCvIdDataLoader<Skill>>()
                    .LoadAsync(context.Source.Id);
            });
    }
}
