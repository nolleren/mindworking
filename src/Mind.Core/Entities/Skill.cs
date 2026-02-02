namespace Mind.Core.Entities;

public sealed class Skill : BaseEntity
{
    public required string Name { get; set; }
    public required string Description { get; set; }
    public SkillMasteryLevel LevelOfMastery { get; set; } = SkillMasteryLevel.Basis;
    public ICollection<Cv> Cvs { get; set; } = new List<Cv>();
}
