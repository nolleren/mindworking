using GraphQL.DataLoader;

namespace Mind.Api.GraphQL.DataLoaders;

internal abstract class DictionaryCollectionDataLoader<TKey, TValue> : DataLoaderBase<TKey, IReadOnlyList<TValue>>
    where TKey : notnull
{
    protected abstract Task<IReadOnlyDictionary<TKey, IReadOnlyList<TValue>>> LoadBatchAsync(
        IReadOnlyCollection<TKey> keys,
        CancellationToken cancellationToken);

    protected sealed override async Task FetchAsync(
        IEnumerable<DataLoaderPair<TKey, IReadOnlyList<TValue>>> list,
        CancellationToken cancellationToken)
    {
        var pairs = list as DataLoaderPair<TKey, IReadOnlyList<TValue>>[] ?? list.ToArray();
        var keys = pairs.Select(x => x.Key).Distinct().ToArray();

        var batch = await LoadBatchAsync(keys, cancellationToken);

        foreach (var pair in pairs)
        {
            if (batch.TryGetValue(pair.Key, out var values))
            {
                pair.SetResult(values);
            }
            else
            {
                pair.SetResult(Array.Empty<TValue>());
            }
        }
    }
}
