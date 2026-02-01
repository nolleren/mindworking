using Mind.Application.Services;
using Mind.Core.Entities;

namespace Mind.Api.GraphQL.DataLoaders;

internal sealed class CvsByEntityIdDataLoader<TEntity> : DictionaryCollectionDataLoader<Guid, Cv>
    where TEntity : BaseEntity
{
    private readonly ICvsByEntityIdsService<TEntity> _service;

    public CvsByEntityIdDataLoader(ICvsByEntityIdsService<TEntity> service)
    {
        _service = service;
    }

    protected override Task<IReadOnlyDictionary<Guid, IReadOnlyList<Cv>>> LoadBatchAsync(
        IReadOnlyCollection<Guid> keys,
        CancellationToken cancellationToken)
        => _service.GetCvsByEntityIdsAsync(keys, cancellationToken);
}
