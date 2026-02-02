using Mind.Application.Services;
using Mind.Core.Entities;

namespace Mind.Presentation.GraphQL.DataLoaders;

internal sealed class CvsByEntityIdDataLoader<TEntity>(ICvsByEntityIdsService<TEntity> service) : DictionaryCollectionDataLoader<Guid, Cv>
    where TEntity : BaseEntity
{
    protected override Task<IReadOnlyDictionary<Guid, IReadOnlyList<Cv>>> LoadBatchAsync(
        IReadOnlyCollection<Guid> keys,
        CancellationToken cancellationToken)
        => service.GetCvsByEntityIdsAsync(keys, cancellationToken);
}
