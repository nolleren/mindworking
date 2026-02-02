using Microsoft.EntityFrameworkCore;
using Mind.Application.Inputs;
using Mind.Application.Services;
using Mind.Core.Entities;
using Mind.Infrastructure.Persistence;

namespace Mind.Infrastructure.Services;

internal sealed class ProjectService(IDbContextFactory<MindDbContext> dbFactory) : IProjectService
{
	private MindDbContext _context => dbFactory.CreateDbContext();

    public async Task<IReadOnlyList<Project>> GetAllAsync(CancellationToken cancellationToken = default)
    {
		await using var db = _context;
        return await db.Projects
            .AsNoTracking()
            .OrderBy(x => x.Name)
            .ToListAsync(cancellationToken);
    }

    public async Task<Project?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
		await using var db = _context;
        return await db.Projects
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
    }

    public async Task<Project> CreateAsync(ProjectCreateInput input, CancellationToken cancellationToken = default)
    {
		await using var db = _context;
        var entity = new Project
        {
            Name = input.Name!.Trim(),
            StartDate = input.StartDate,
            EndDate = input.EndDate,
            Description = input.Description.Trim(),
        };

        db.Projects.Add(entity);
        await db.SaveChangesAsync(cancellationToken);
        return entity;
    }

    public async Task<Project> UpdateAsync(ProjectUpsertInput input, CancellationToken cancellationToken = default)
    {
		await using var db = _context;
        var id = input.Id;
        var entity = await db.Projects.FirstOrDefaultAsync(x => x.Id == id, cancellationToken)
            ?? throw new InvalidOperationException($"Unknown project id '{id}'.");

        entity.Name = input.Name.Trim();
        entity.StartDate = input.StartDate;
        entity.EndDate = input.EndDate;
        entity.Description = input.Description.Trim();

        await db.SaveChangesAsync(cancellationToken);
        return entity;
    }

    public async Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
		await using var db = _context;
        var entity = await db.Projects.FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
        if (entity is null)
        {
            return false;
        }

        var hasDependencies = await db.Entry(entity).Collection(x => x.Cvs).Query().AnyAsync(cancellationToken);
        if (hasDependencies)
        {
            throw new InvalidOperationException("Cannot delete project because it is linked to one or more CVs.");
        }

        db.Projects.Remove(entity);
        await db.SaveChangesAsync(cancellationToken);
        return true;
    }
}
