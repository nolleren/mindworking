using Microsoft.EntityFrameworkCore;
using Mind.Application.Services;
using Mind.Core.Entities;
using Mind.Infrastructure.Persistence;

namespace Mind.Infrastructure.Services;

internal sealed class CompanyService : ICompanyService
{
    private readonly MindDbContext _db;

    public CompanyService(MindDbContext db)
    {
        _db = db;
    }

    public async Task<IReadOnlyList<Company>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return await _db.Companies
            .AsNoTracking()
            .OrderBy(x => x.Name)
            .ToListAsync(cancellationToken);
    }

    public async Task<Company?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _db.Companies
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
    }

    public async Task<IReadOnlyDictionary<Guid, Company>> GetByIdsAsync(IReadOnlyCollection<Guid> ids, CancellationToken cancellationToken = default)
    {
        if (ids.Count == 0)
        {
            return new Dictionary<Guid, Company>();
        }

        return await _db.Companies
            .AsNoTracking()
            .Where(x => ids.Contains(x.Id))
            .ToDictionaryAsync(x => x.Id, cancellationToken);
    }

    public Task<IReadOnlyList<Company>> CreateManyAsync(IReadOnlyList<EntityCreateRequest> createRequests, CancellationToken cancellationToken = default)
    {
        var created = createRequests
            .Where(x => !string.IsNullOrWhiteSpace(x.Name))
            .Select(x => new Company
            {
                Name = x.Name.Trim(),
                Address = string.IsNullOrWhiteSpace(x.Address) ? null : x.Address.Trim(),
                ZipCode = string.IsNullOrWhiteSpace(x.ZipCode) ? null : x.ZipCode.Trim(),
                City = string.IsNullOrWhiteSpace(x.City) ? null : x.City.Trim(),
                Description = string.IsNullOrWhiteSpace(x.Description) ? null : x.Description.Trim(),
            })
            .ToList();

        _db.Companies.AddRange(created);

        return Task.FromResult((IReadOnlyList<Company>)created);
    }
}
