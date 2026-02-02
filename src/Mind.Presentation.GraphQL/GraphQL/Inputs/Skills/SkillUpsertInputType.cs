using GraphQL.Types;
using Mind.Presentation.GraphQL.Types;
using Mind.Application.Inputs;

namespace Mind.Presentation.GraphQL.Inputs;

public sealed class SkillUpsertInputType : InputObjectGraphType<SkillUpsertInput>
{
    public SkillUpsertInputType()
    {
        Name = "SkillUpsertInput";

        Field(x => x.Id, type: typeof(NonNullGraphType<IdGraphType>));
        Field(x => x.Name, type: typeof(NonNullGraphType<StringGraphType>));
        Field(x => x.Description, type: typeof(NonNullGraphType<StringGraphType>));
        Field(x => x.LevelOfMastery, type: typeof(NonNullGraphType<SkillMasteryLevelEnumType>));
    }
}
