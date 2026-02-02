using GraphQL.DataLoader;
using GraphQL.Types;
using Mind.Presentation.GraphQL.DataLoaders;
using Mind.Core.Entities;

namespace Mind.Presentation.GraphQL.Types;

public sealed class SkillType : ObjectGraphType<Skill>
{
    public SkillType()
    {
        Name = "Skill";

        Field(x => x.Id, type: typeof(NonNullGraphType<IdGraphType>));
        Field(x => x.Name);
        Field(x => x.Description, nullable: true);

        Field<NonNullGraphType<SkillMasteryLevelEnumType>>("levelOfMastery")
            .Resolve(ctx => ctx.Source.LevelOfMastery);
        Field(x => x.CreatedAt, type: typeof(NonNullGraphType<DateTimeGraphType>));
        Field(x => x.UpdatedAt, type: typeof(NonNullGraphType<DateTimeGraphType>));

        Field<NonNullGraphType<BooleanGraphType>>("canDelete")
            .ResolveAsync(async context =>
            {
                var services = context.RequestServices ?? throw new InvalidOperationException("RequestServices is not available.");
                var cvs = await services
                    .GetRequiredService<CvsByEntityIdDataLoader<Skill>>()
                    .LoadAsync(context.Source.Id)
                    .GetResultAsync();

                return cvs.Count == 0;
            });

        Field<ListGraphType<NonNullGraphType<CvType>>>("cvs")
            .Resolve(context =>
            {
                var services = context.RequestServices ?? throw new InvalidOperationException("RequestServices is not available.");
                return services
                    .GetRequiredService<CvsByEntityIdDataLoader<Skill>>()
                    .LoadAsync(context.Source.Id);
            });
    }
}
