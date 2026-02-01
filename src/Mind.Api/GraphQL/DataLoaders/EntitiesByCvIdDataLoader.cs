using Mind.Application.Services;
using Mind.Core.Entities;

namespace Mind.Api.GraphQL.DataLoaders;

internal sealed class EntitiesByCvIdDataLoader<TEntity> : DictionaryCollectionDataLoader<Guid, TEntity>
    where TEntity : BaseEntity
{
    private readonly IEntitiesByCvIdsService<TEntity> _service;

    public EntitiesByCvIdDataLoader(IEntitiesByCvIdsService<TEntity> service)
    {
        _service = service;
    }

    protected override Task<IReadOnlyDictionary<Guid, IReadOnlyList<TEntity>>> LoadBatchAsync(
        IReadOnlyCollection<Guid> keys,
        CancellationToken cancellationToken)
        => _service.GetByCvIdsAsync(keys, cancellationToken);
}
