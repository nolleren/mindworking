namespace Mind.Application.Inputs;

public sealed class ProjectUpsertInput
{
    public Guid? Id { get; init; }

    public required string Name { get; init; }
    public required DateTime StartDate { get; init; }
    public required DateTime EndDate { get; init; }
    public required string Description { get; init; }
}
