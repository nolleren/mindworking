using Mind.Core.Entities;

namespace Mind.Application.Services;

public interface IEducationService
{
    Task<IReadOnlyList<Education>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<Education?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<IReadOnlyDictionary<Guid, Education>> GetByIdsAsync(IReadOnlyCollection<Guid> ids, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<Education>> CreateManyAsync(IReadOnlyList<EntityCreateRequest> createRequests, CancellationToken cancellationToken = default);
}
