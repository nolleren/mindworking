using Mind.Core.Entities;
using Mind.Application.Inputs;

namespace Mind.Application.Services;

public interface ICvService
{
    Task<IReadOnlyList<Cv>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<Cv?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<Cv> CreateAsync(CvCreateInput request, CancellationToken cancellationToken = default);
    Task<Cv> UpdateAsync(CvUpdateInput request, CancellationToken cancellationToken = default);
    Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default);
}
