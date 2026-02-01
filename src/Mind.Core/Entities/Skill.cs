namespace Mind.Core.Entities;

public sealed class Skill : BaseEntity
{
    public string Name { get; set; } = string.Empty;

    public string? Description { get; set; }
    public SkillMasteryLevel LevelOfMastery { get; set; } = SkillMasteryLevel.Basis;

    public ICollection<Cv> Cvs { get; set; } = new List<Cv>();
}
