using Microsoft.EntityFrameworkCore;
using Mind.Application.Services;
using Mind.Core.Entities;
using Mind.Infrastructure.Persistence;

namespace Mind.Infrastructure.Services;

internal sealed class SkillService : ISkillService
{
    private readonly MindDbContext _db;

    public SkillService(MindDbContext db)
    {
        _db = db;
    }

    public async Task<IReadOnlyList<Skill>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return await _db.Skills
            .AsNoTracking()
            .OrderBy(x => x.Name)
            .ToListAsync(cancellationToken);
    }

    public async Task<Skill?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _db.Skills
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
    }

    public async Task<IReadOnlyDictionary<Guid, Skill>> GetByIdsAsync(IReadOnlyCollection<Guid> ids, CancellationToken cancellationToken = default)
    {
        if (ids.Count == 0)
        {
            return new Dictionary<Guid, Skill>();
        }

        return await _db.Skills
            .AsNoTracking()
            .Where(x => ids.Contains(x.Id))
            .ToDictionaryAsync(x => x.Id, cancellationToken);
    }

    public Task<IReadOnlyList<Skill>> CreateManyAsync(IReadOnlyList<EntityCreateRequest> createRequests, CancellationToken cancellationToken = default)
    {
        var created = createRequests
            .Where(x => !string.IsNullOrWhiteSpace(x.Name))
            .Select(x => new Skill
            {
                Name = x.Name.Trim(),
                Description = string.IsNullOrWhiteSpace(x.Description) ? null : x.Description.Trim(),
                LevelOfMastery = x.LevelOfMastery ?? SkillMasteryLevel.Basis,
            })
            .ToList();

        _db.Skills.AddRange(created);

        return Task.FromResult((IReadOnlyList<Skill>)created);
    }
}
