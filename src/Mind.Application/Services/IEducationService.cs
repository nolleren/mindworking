using Mind.Core.Entities;
using Mind.Application.Inputs;

namespace Mind.Application.Services;

public interface IEducationService
{
    Task<IReadOnlyList<Education>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<Education?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<Education>> CreateEducationsAsync(IReadOnlyList<EducationCreateInput> createRequests, CancellationToken cancellationToken = default);
    Task<Education> CreateAsync(EducationCreateInput input, CancellationToken cancellationToken = default);
    Task<Education> UpdateAsync(EducationUpsertInput input, CancellationToken cancellationToken = default);
    Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default);
}
