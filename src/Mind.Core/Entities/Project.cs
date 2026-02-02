namespace Mind.Core.Entities;

public sealed class Project : BaseEntity
{
    public required string Name { get; set; }
    public required DateTime StartDate { get; set; }
    public required DateTime EndDate { get; set; }
    public required string Description { get; set; }
    public ICollection<Cv> Cvs { get; set; } = new List<Cv>();
}
