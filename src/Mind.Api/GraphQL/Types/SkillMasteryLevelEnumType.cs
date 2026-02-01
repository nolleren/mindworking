using GraphQL.Types;
using Mind.Core.Entities;

namespace Mind.Api.GraphQL.Types;

public sealed class SkillMasteryLevelEnumType : EnumerationGraphType<SkillMasteryLevel>
{
    public SkillMasteryLevelEnumType()
    {
        Name = "SkillMasteryLevel";
    }
}
