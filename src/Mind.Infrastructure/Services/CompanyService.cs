using Microsoft.EntityFrameworkCore;
using Mind.Application.Inputs;
using Mind.Application.Services;
using Mind.Core.Entities;
using Mind.Infrastructure.Persistence;

namespace Mind.Infrastructure.Services;

internal sealed class CompanyService(MindDbContext db) : ICompanyService
{
    public async Task<IReadOnlyList<Company>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return await db.Companies
            .AsNoTracking()
            .OrderBy(x => x.Name)
            .ToListAsync(cancellationToken);
    }

    public async Task<Company?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await db.Companies
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
    }

    public Task<IReadOnlyList<Company>> CreateCompaniesAsync(IReadOnlyList<CompanyCreateInput> createRequests, CancellationToken cancellationToken = default)
    {
        var created = createRequests
            .Select(x => new Company
            {
                Name = x.Name.Trim(),
                Address = x.Address.Trim(),
                ZipCode = x.ZipCode.Trim(),
                City = x.City.Trim(),
                Description = x.Description.Trim(),
            })
            .ToList();
        db.Companies.AddRange(created);

        return Task.FromResult((IReadOnlyList<Company>)created);
    }

    public async Task<Company> CreateAsync(CompanyCreateInput input, CancellationToken cancellationToken = default)
    {
        var entity = new Company
        {
            Name = input.Name.Trim(),
            Address = input.Address.Trim(),
            ZipCode = input.ZipCode.Trim(),
            City = input.City.Trim(),
            Description = input.Description.Trim(),
        };

        db.Companies.Add(entity);
        await db.SaveChangesAsync(cancellationToken);
        return entity;
    }

    public async Task<Company> UpdateAsync(CompanyUpsertInput input, CancellationToken cancellationToken = default)
    {
        if (input.Id == null)
        {
            throw new ArgumentException("Id is required for update.", nameof(input));
        }

        var id = input.Id.Value;
        var entity = await db.Companies.FirstOrDefaultAsync(x => x.Id == id, cancellationToken)
            ?? throw new InvalidOperationException($"Unknown company id '{id}'.");

        entity.Name = input.Name.Trim();
        entity.Address = input.Address.Trim();
        entity.ZipCode = input.ZipCode.Trim();
        entity.City = input.City.Trim();
        entity.Description = input.Description.Trim();

        await db.SaveChangesAsync(cancellationToken);
        return entity;
    }

    public async Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var entity = await db.Companies.FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
        if (entity is null)
        {
            return false;
        }

        var hasDependencies = await db.Entry(entity).Collection(x => x.Cvs).Query().AnyAsync(cancellationToken);
        if (hasDependencies)
        {
            throw new InvalidOperationException("Cannot delete company because it is linked to one or more CVs.");
        }

        db.Companies.Remove(entity);
        await db.SaveChangesAsync(cancellationToken);
        return true;
    }
}
