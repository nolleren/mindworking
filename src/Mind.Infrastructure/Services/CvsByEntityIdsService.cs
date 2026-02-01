using Mind.Application.Services;
using Mind.Core.Entities;

namespace Mind.Infrastructure.Services;

internal sealed class CvsByEntityIdsService<TEntity> : ICvsByEntityIdsService<TEntity>
    where TEntity : BaseEntity
{
    private readonly ICvService _cvService;

    public CvsByEntityIdsService(ICvService cvService)
    {
        _cvService = cvService;
    }

    public Task<IReadOnlyDictionary<Guid, IReadOnlyList<Cv>>> GetCvsByEntityIdsAsync(
        IReadOnlyCollection<Guid> entityIds,
        CancellationToken cancellationToken = default)
    {
        if (typeof(TEntity) == typeof(Company))
        {
            return _cvService.GetByCompanyIdsAsync(entityIds, cancellationToken);
        }

        if (typeof(TEntity) == typeof(Project))
        {
            return _cvService.GetByProjectIdsAsync(entityIds, cancellationToken);
        }

        if (typeof(TEntity) == typeof(Education))
        {
            return _cvService.GetByEducationIdsAsync(entityIds, cancellationToken);
        }

        if (typeof(TEntity) == typeof(Skill))
        {
            return _cvService.GetBySkillIdsAsync(entityIds, cancellationToken);
        }

        throw new NotSupportedException($"No CV lookup is registered for entity type '{typeof(TEntity).Name}'.");
    }
}
