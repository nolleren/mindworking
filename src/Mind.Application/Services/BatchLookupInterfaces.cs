using Mind.Core.Entities;

namespace Mind.Application.Services;

public interface IEntitiesByCvIdsService<TEntity>
    where TEntity : BaseEntity
{
    Task<IReadOnlyDictionary<Guid, IReadOnlyList<TEntity>>> GetByCvIdsAsync(
        IReadOnlyCollection<Guid> cvIds,
        CancellationToken cancellationToken = default);
}

public interface ICvsByEntityIdsService<TEntity>
    where TEntity : BaseEntity
{
    Task<IReadOnlyDictionary<Guid, IReadOnlyList<Cv>>> GetCvsByEntityIdsAsync(
        IReadOnlyCollection<Guid> entityIds,
        CancellationToken cancellationToken = default);
}
