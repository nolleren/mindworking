namespace Mind.Core.Entities;

public sealed class Project : BaseEntity
{
    public string Name { get; set; } = string.Empty;

    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public string? Description { get; set; }

    public ICollection<Cv> Cvs { get; set; } = new List<Cv>();
}
