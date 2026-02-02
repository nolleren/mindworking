namespace Mind.Application.Inputs;

public sealed class CompanyUpsertInput
{
    public Guid? Id { get; init; }

    public required string Name { get; init; }
    public required string Address { get; init; }
    public required string ZipCode { get; init; }
    public required string City { get; init; }
    public required string Description { get; init; }
}
