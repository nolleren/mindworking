using Mind.Application.Services;
using Mind.Core.Entities;
using Mind.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace Mind.Infrastructure.Services;

internal sealed class EntitiesByCvIdsService<TEntity> : IEntitiesByCvIdsService<TEntity>
    where TEntity : BaseEntity
{
    private readonly MindDbContext _db;

    public EntitiesByCvIdsService(MindDbContext db)
    {
        _db = db;
    }

    public async Task<IReadOnlyDictionary<Guid, IReadOnlyList<TEntity>>> GetByCvIdsAsync(
        IReadOnlyCollection<Guid> cvIds,
        CancellationToken cancellationToken = default)
    {
        if (cvIds.Count == 0)
        {
            return new Dictionary<Guid, IReadOnlyList<TEntity>>();
        }

        var ids = cvIds.Distinct().ToArray();

        if (typeof(TEntity) == typeof(Company))
        {
            var result = await GetByCvIdsInternalAsync(ids, cv => cv.Companies, cancellationToken);
            return (IReadOnlyDictionary<Guid, IReadOnlyList<TEntity>>)(object)result;
        }

        if (typeof(TEntity) == typeof(Project))
        {
            var result = await GetByCvIdsInternalAsync(ids, cv => cv.Projects, cancellationToken);
            return (IReadOnlyDictionary<Guid, IReadOnlyList<TEntity>>)(object)result;
        }

        if (typeof(TEntity) == typeof(Education))
        {
            var result = await GetByCvIdsInternalAsync(ids, cv => cv.Educations, cancellationToken);
            return (IReadOnlyDictionary<Guid, IReadOnlyList<TEntity>>)(object)result;
        }

        if (typeof(TEntity) == typeof(Skill))
        {
            var result = await GetByCvIdsInternalAsync(ids, cv => cv.Skills, cancellationToken);
            return (IReadOnlyDictionary<Guid, IReadOnlyList<TEntity>>)(object)result;
        }

        throw new NotSupportedException($"No {nameof(IEntitiesByCvIdsService<TEntity>)} mapping registered for entity type '{typeof(TEntity).Name}'.");
    }

    private async Task<IReadOnlyDictionary<Guid, IReadOnlyList<T>>> GetByCvIdsInternalAsync<T>(
        IReadOnlyCollection<Guid> cvIds,
        Expression<Func<Cv, IEnumerable<T>>> navigation,
        CancellationToken cancellationToken)
        where T : BaseEntity
    {
        var pairs = await _db.Cvs
            .AsNoTracking()
            .Where(cv => cvIds.Contains(cv.Id))
            .SelectMany(navigation, (cv, entity) => new { CvId = cv.Id, Entity = entity })
            .ToListAsync(cancellationToken);

        var result = pairs
            .GroupBy(x => x.CvId)
            .ToDictionary(
                g => g.Key,
                g => (IReadOnlyList<T>)g.Select(x => x.Entity).ToList());

        foreach (var cvId in cvIds)
        {
            result.TryAdd(cvId, Array.Empty<T>());
        }

        return result;
    }
}
