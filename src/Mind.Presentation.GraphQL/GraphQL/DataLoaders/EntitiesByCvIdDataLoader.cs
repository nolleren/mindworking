using Mind.Application.Services;
using Mind.Core.Entities;

namespace Mind.Presentation.GraphQL.DataLoaders;

internal sealed class EntitiesByCvIdDataLoader<TEntity>(IEntitiesByCvIdsService<TEntity> service) : DictionaryCollectionDataLoader<Guid, TEntity>
    where TEntity : BaseEntity
{
    protected override Task<IReadOnlyDictionary<Guid, IReadOnlyList<TEntity>>> LoadBatchAsync(
        IReadOnlyCollection<Guid> keys,
        CancellationToken cancellationToken)
        => service.GetByCvIdsAsync(keys, cancellationToken);
}
