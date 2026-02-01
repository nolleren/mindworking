namespace Mind.Core.Entities;

public sealed class Company : BaseEntity
{
    public string Name { get; set; } = string.Empty;

    public string? Address { get; set; }
    public string? ZipCode { get; set; }
    public string? City { get; set; }
    public string? Description { get; set; }

    public ICollection<Cv> Cvs { get; set; } = new List<Cv>();
}
