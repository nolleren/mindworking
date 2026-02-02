using Mind.Core.Entities;
using Mind.Application.Inputs;

namespace Mind.Application.Services;

public interface ICompanyService
{
    Task<IReadOnlyList<Company>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<Company?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<Company> CreateAsync(CompanyCreateInput input, CancellationToken cancellationToken = default);
    Task<Company> UpdateAsync(CompanyUpsertInput input, CancellationToken cancellationToken = default);
    Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default);
}
