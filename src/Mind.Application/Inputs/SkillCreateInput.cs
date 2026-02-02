using Mind.Core.Entities;

namespace Mind.Application.Inputs;

public sealed class SkillCreateInput
{
    public required string Name { get; init; }
    public required string Description { get; init; } 
    public required SkillMasteryLevel LevelOfMastery { get; init; }

    public Skill ToSkill()
    {
        return new Skill
        {
            Name = this.Name,
            Description = this.Description,
            LevelOfMastery = this.LevelOfMastery
        };
    }
}
