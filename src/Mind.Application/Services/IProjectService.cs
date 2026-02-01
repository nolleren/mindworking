using Mind.Core.Entities;

namespace Mind.Application.Services;

public interface IProjectService
{
    Task<IReadOnlyList<Project>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<Project?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<IReadOnlyDictionary<Guid, Project>> GetByIdsAsync(IReadOnlyCollection<Guid> ids, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<Project>> CreateManyAsync(IReadOnlyList<EntityCreateRequest> createRequests, CancellationToken cancellationToken = default);
}
