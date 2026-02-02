using Mind.Core.Entities;

namespace Mind.Application.Inputs;

public sealed class ProjectUpsertInput
{
    public required Guid Id { get; init; }

    public required string Name { get; init; }
    public required DateTime StartDate { get; init; }
    public required DateTime EndDate { get; init; }
    public required string Description { get; init; }

    public Project ToProject()
    {
        return new Project
        {
            Id = this.Id,
            Name = this.Name,
            StartDate = this.StartDate,
            EndDate = this.EndDate,
            Description = this.Description
        };
    }
}
