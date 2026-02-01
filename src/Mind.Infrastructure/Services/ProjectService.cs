using Microsoft.EntityFrameworkCore;
using Mind.Application.Services;
using Mind.Core.Entities;
using Mind.Infrastructure.Persistence;

namespace Mind.Infrastructure.Services;

internal sealed class ProjectService : IProjectService
{
    private readonly MindDbContext _db;

    public ProjectService(MindDbContext db)
    {
        _db = db;
    }

    public async Task<IReadOnlyList<Project>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return await _db.Projects
            .AsNoTracking()
            .OrderBy(x => x.Name)
            .ToListAsync(cancellationToken);
    }

    public async Task<Project?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _db.Projects
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
    }

    public async Task<IReadOnlyDictionary<Guid, Project>> GetByIdsAsync(IReadOnlyCollection<Guid> ids, CancellationToken cancellationToken = default)
    {
        if (ids.Count == 0)
        {
            return new Dictionary<Guid, Project>();
        }

        return await _db.Projects
            .AsNoTracking()
            .Where(x => ids.Contains(x.Id))
            .ToDictionaryAsync(x => x.Id, cancellationToken);
    }

    public Task<IReadOnlyList<Project>> CreateManyAsync(IReadOnlyList<EntityCreateRequest> createRequests, CancellationToken cancellationToken = default)
    {
        var created = createRequests
            .Where(x => !string.IsNullOrWhiteSpace(x.Name))
            .Select(x => new Project
            {
                Name = x.Name.Trim(),
                StartDate = x.StartDate,
                EndDate = x.EndDate,
                Description = string.IsNullOrWhiteSpace(x.Description) ? null : x.Description.Trim(),
            })
            .ToList();

        _db.Projects.AddRange(created);

        return Task.FromResult((IReadOnlyList<Project>)created);
    }
}
