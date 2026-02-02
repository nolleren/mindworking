using GraphQL.Types;
using Mind.Presentation.GraphQL.Types;
using Mind.Application.Inputs;

namespace Mind.Presentation.GraphQL.Inputs
{
    public class SkillsCreateInputType : InputObjectGraphType<SkillCreateInput>
    {
        public SkillsCreateInputType()
        {
            Name = "SkillCreateInput";

            Field(x => x.Name, type: typeof(NonNullGraphType<StringGraphType>));
            Field(x => x.Description, type: typeof(NonNullGraphType<StringGraphType>));
            Field(x => x.LevelOfMastery, type: typeof(NonNullGraphType<SkillMasteryLevelEnumType>));
        }
    }
}
