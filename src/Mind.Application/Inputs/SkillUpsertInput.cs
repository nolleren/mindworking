using Mind.Core.Entities;

namespace Mind.Application.Inputs;

public sealed class SkillUpsertInput
{
    public Guid? Id { get; init; }

    public required string Name { get; init; }
    public required string Description { get; init; }
    public SkillMasteryLevel LevelOfMastery { get; init; } = SkillMasteryLevel.Basis;
}
