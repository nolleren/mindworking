using Microsoft.EntityFrameworkCore;
using Mind.Application.Services;
using Mind.Core.Entities;
using Mind.Infrastructure.Persistence;
using System.Linq.Expressions;

namespace Mind.Infrastructure.Services;

internal sealed class CvsByEntityIdsService<TEntity>(MindDbContext db) : ICvsByEntityIdsService<TEntity>
    where TEntity : BaseEntity
{
    public Task<IReadOnlyDictionary<Guid, IReadOnlyList<Cv>>> GetCvsByEntityIdsAsync(
        IReadOnlyCollection<Guid> entityIds,
        CancellationToken cancellationToken = default)
    {
        if (entityIds.Count == 0)
        {
            return Task.FromResult((IReadOnlyDictionary<Guid, IReadOnlyList<Cv>>)new Dictionary<Guid, IReadOnlyList<Cv>>());
        }

        var ids = entityIds.Distinct().ToArray();

        if (typeof(TEntity) == typeof(Company))
        {
            return GetByEntityIdsInternalAsync<Company>(ids, x => x.Cvs, cancellationToken);
        }

        if (typeof(TEntity) == typeof(Project))
        {
            return GetByEntityIdsInternalAsync<Project>(ids, x => x.Cvs, cancellationToken);
        }

        if (typeof(TEntity) == typeof(Education))
        {
            return GetByEntityIdsInternalAsync<Education>(ids, x => x.Cvs, cancellationToken);
        }

        if (typeof(TEntity) == typeof(Skill))
        {
            return GetByEntityIdsInternalAsync<Skill>(ids, x => x.Cvs, cancellationToken);
        }

        throw new NotSupportedException($"No CV lookup is registered for entity type '{typeof(TEntity).Name}'.");
    }

    private async Task<IReadOnlyDictionary<Guid, IReadOnlyList<Cv>>> GetByEntityIdsInternalAsync<T>(
        IReadOnlyCollection<Guid> entityIds,
        Expression<Func<T, IEnumerable<Cv>>> navigation,
        CancellationToken cancellationToken)
        where T : BaseEntity
    {
        var pairs = await db.Set<T>()
            .AsNoTracking()
            .Where(e => entityIds.Contains(e.Id))
            .SelectMany(navigation, (entity, cv) => new { EntityId = entity.Id, Cv = cv })
            .ToListAsync(cancellationToken);

        var result = pairs
            .GroupBy(x => x.EntityId)
            .ToDictionary(
                g => g.Key,
                g => (IReadOnlyList<Cv>)g.Select(x => x.Cv).OrderBy(cv => cv.Name).ToList());

        foreach (var id in entityIds)
        {
            result.TryAdd(id, Array.Empty<Cv>());
        }

        return result;
    }
}
