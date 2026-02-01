using Microsoft.EntityFrameworkCore;
using Mind.Application.Services;
using Mind.Core.Entities;
using Mind.Infrastructure.Persistence;

namespace Mind.Infrastructure.Services;

internal sealed class EducationService : IEducationService
{
    private readonly MindDbContext _db;

    public EducationService(MindDbContext db)
    {
        _db = db;
    }

    public async Task<IReadOnlyList<Education>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return await _db.Educations
            .AsNoTracking()
            .OrderBy(x => x.Name)
            .ToListAsync(cancellationToken);
    }

    public async Task<Education?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _db.Educations
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
    }

    public async Task<IReadOnlyDictionary<Guid, Education>> GetByIdsAsync(IReadOnlyCollection<Guid> ids, CancellationToken cancellationToken = default)
    {
        if (ids.Count == 0)
        {
            return new Dictionary<Guid, Education>();
        }

        return await _db.Educations
            .AsNoTracking()
            .Where(x => ids.Contains(x.Id))
            .ToDictionaryAsync(x => x.Id, cancellationToken);
    }

    public Task<IReadOnlyList<Education>> CreateManyAsync(IReadOnlyList<EntityCreateRequest> createRequests, CancellationToken cancellationToken = default)
    {
        var created = createRequests
            .Where(x => !string.IsNullOrWhiteSpace(x.Name))
            .Select(x => new Education
            {
                Name = x.Name.Trim(),
                Address = string.IsNullOrWhiteSpace(x.Address) ? null : x.Address.Trim(),
                ZipCode = string.IsNullOrWhiteSpace(x.ZipCode) ? null : x.ZipCode.Trim(),
                City = string.IsNullOrWhiteSpace(x.City) ? null : x.City.Trim(),
                Description = string.IsNullOrWhiteSpace(x.Description) ? null : x.Description.Trim(),
            })
            .ToList();

        _db.Educations.AddRange(created);

        return Task.FromResult((IReadOnlyList<Education>)created);
    }
}
