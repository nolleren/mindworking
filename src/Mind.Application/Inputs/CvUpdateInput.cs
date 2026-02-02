namespace Mind.Application.Inputs;

public sealed class CvUpdateInput
{
    public required Guid Id { get; init; }

    public required string Name { get; init; }

    // If null: no change. If provided (even empty list): replace relation to match.
    public List<Guid>? Companies { get; init; }
    public List<Guid>? Projects { get; init; }
    public List<Guid>? Educations { get; init; }
    public List<Guid>? Skills { get; init; }
}
