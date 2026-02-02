using GraphQL.Types;
using Mind.Core.Entities;

namespace Mind.Presentation.GraphQL.Types;

public sealed class SkillMasteryLevelEnumType : EnumerationGraphType<SkillMasteryLevel>
{
    public SkillMasteryLevelEnumType()
    {
        Name = "SkillMasteryLevel";
    }
}
