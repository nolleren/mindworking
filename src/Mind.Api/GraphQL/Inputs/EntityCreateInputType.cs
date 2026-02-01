using GraphQL.Types;
using Mind.Api.GraphQL.Types;
using Mind.Application.Services;

namespace Mind.Api.GraphQL.Inputs;

public sealed class EntityCreateInputType : InputObjectGraphType<EntityCreateRequest>
{
    public EntityCreateInputType()
    {
        Name = "EntityCreateInput";

        Field(x => x.Name, type: typeof(NonNullGraphType<StringGraphType>));

        Field(x => x.Address, nullable: true);
        Field(x => x.ZipCode, nullable: true);
        Field(x => x.City, nullable: true);
        Field(x => x.Description, nullable: true);

        Field(x => x.StartDate, type: typeof(DateTimeGraphType));
        Field(x => x.EndDate, type: typeof(DateTimeGraphType));

        Field(x => x.LevelOfMastery, type: typeof(SkillMasteryLevelEnumType));
    }
}
