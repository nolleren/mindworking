namespace Mind.Core.Entities;

public sealed class Education : BaseEntity
{
    public required string Name { get; set; }
    public required string Address { get; set; }
    public required string ZipCode { get; set; }
    public required string City { get; set; }
    public required string Description { get; set; }
    public ICollection<Cv> Cvs { get; set; } = new List<Cv>();
}
