using Microsoft.EntityFrameworkCore;
using Mind.Application.Inputs;
using Mind.Application.Services;
using Mind.Core.Entities;
using Mind.Infrastructure.Persistence;

namespace Mind.Infrastructure.Services;

internal sealed class EducationService(IDbContextFactory<MindDbContext> dbFactory) : IEducationService
{
	private MindDbContext _context => dbFactory.CreateDbContext();

    public async Task<IReadOnlyList<Education>> GetAllAsync(CancellationToken cancellationToken = default)
    {
		await using var db = _context;
        return await db.Educations
            .AsNoTracking()
            .OrderBy(x => x.Name)
            .ToListAsync(cancellationToken);
    }

    public async Task<Education?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
		await using var db = _context;
        return await db.Educations
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
    }

    public async Task<Education> CreateAsync(EducationCreateInput input, CancellationToken cancellationToken = default)
    {
		await using var db = _context;
        var entity = new Education
        {
            Name = input.Name!.Trim(),
            Address = input.Address!.Trim(),
            ZipCode = input.ZipCode!.Trim(),
            City = input.City!.Trim(),
            Description = input.Description!.Trim(),
        };

        db.Educations.Add(entity);
        await db.SaveChangesAsync(cancellationToken);
        return entity;
    }

    public async Task<Education> UpdateAsync(EducationUpsertInput input, CancellationToken cancellationToken = default)
    {
		await using var db = _context;
        var id = input.Id;
        var entity = await db.Educations.FirstOrDefaultAsync(x => x.Id == id, cancellationToken)
            ?? throw new InvalidOperationException($"Unknown education id '{id}'.");

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
		await using var db = _context;
        var entity = await db.Educations.FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
        if (entity is null)
        {
            return false;
        }

        var hasDependencies = await db.Entry(entity).Collection(x => x.Cvs).Query().AnyAsync(cancellationToken);
        if (hasDependencies)
        {
            throw new InvalidOperationException("Cannot delete education because it is linked to one or more CVs.");
        }

        db.Educations.Remove(entity);
        await db.SaveChangesAsync(cancellationToken);
        return true;
    }
}
