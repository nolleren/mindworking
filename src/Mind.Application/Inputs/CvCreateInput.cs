namespace Mind.Application.Inputs;

public sealed class CvCreateInput
{
    public required string Name { get; init; }

    public List<Guid>? Companies { get; init; }
    public List<Guid>? Projects { get; init; }
    public List<Guid>? Educations { get; init; }
    public List<Guid>? Skills { get; init; }
}
