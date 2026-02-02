using Mind.Core.Entities;

namespace Mind.Application.Inputs;

public sealed class CompanyCreateInput
{
    public required string Name { get; init; }
    public required string Address { get; init; }
    public required string ZipCode { get; init; }
    public required string City { get; init; }
    public required string Description { get; init; }

    public Company ToCompany()
    {
        return new Company
        {
            Name = this.Name,
            Address = this.Address,
            ZipCode = this.ZipCode,
            City = this.City,
            Description = this.Description,

        };
    }
}
