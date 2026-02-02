namespace Mind.Core.Entities;

public sealed class Cv : BaseEntity
{
    public required string Name { get; set; }

    public ICollection<Company> Companies { get; set; } = new List<Company>();
    public ICollection<Project> Projects { get; set; } = new List<Project>();
    public ICollection<Education> Educations { get; set; } = new List<Education>();
    public ICollection<Skill> Skills { get; set; } = new List<Skill>();
}
