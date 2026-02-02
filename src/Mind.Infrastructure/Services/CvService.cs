using Microsoft.EntityFrameworkCore;
using Mind.Application.Inputs;
using Mind.Application.Services;
using Mind.Core.Entities;
using Mind.Infrastructure.Persistence;

namespace Mind.Infrastructure.Services;

internal sealed class CvService(
    IDbContextFactory<MindDbContext> dbFactory) : ICvService
{
	private MindDbContext _context => dbFactory.CreateDbContext();

    public async Task<IReadOnlyList<Cv>> GetAllAsync(CancellationToken cancellationToken = default)
    {
		await using var db = _context;
        return await db.Cvs
            .AsNoTracking()
            .OrderBy(x => x.Name)
            .ToListAsync(cancellationToken);
    }

    public async Task<Cv?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
		await using var db = _context;
        return await db.Cvs
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
    }

    public async Task<Cv> CreateAsync(CvCreateInput request, CancellationToken cancellationToken = default)
    {
		await using var db = _context;
        var cv = new Cv { Name = request.Name.Trim() };

        // Attach existing entities by ID
        if (request.Companies != null)
        {
            var companies = await db.Companies.Where(c => request.Companies.Contains(c.Id)).ToListAsync(cancellationToken);
            cv.Companies = companies;
        }

        if (request.Projects != null)
        {
            var projects = await db.Projects.Where(p => request.Projects.Contains(p.Id)).ToListAsync(cancellationToken);
            cv.Projects = projects;
        }

        if (request.Educations != null)
        {
            var educations = await db.Educations.Where(e => request.Educations.Contains(e.Id)).ToListAsync(cancellationToken);
            cv.Educations = educations;
        }

        if (request.Skills != null)
        {
            var skills = await db.Skills.Where(s => request.Skills.Contains(s.Id)).ToListAsync(cancellationToken);
            cv.Skills = skills;
        }

        db.Cvs.Add(cv);
		await db.SaveChangesAsync(cancellationToken);

        return cv;
    }

    public async Task<Cv> UpdateAsync(CvUpdateInput request, CancellationToken cancellationToken = default)
    {
		await using var db = _context;
		var cv = await db.Cvs
            .Include(x => x.Companies)
            .Include(x => x.Projects)
            .Include(x => x.Educations)
            .Include(x => x.Skills)
            .FirstOrDefaultAsync(x => x.Id == request.Id, cancellationToken);

        if (cv is null)
        {
            throw new InvalidOperationException($"Unknown CV id '{request.Id}'.");
        }

        cv.Name = request.Name.Trim();
		cv.Companies.Clear();
		cv.Projects.Clear();
		cv.Educations.Clear();
		cv.Skills.Clear();

		// Attach existing entities by ID
		if (request.Companies != null)
		{
			var companies = await db.Companies.Where(c => request.Companies.Contains(c.Id)).ToListAsync(cancellationToken);
			cv.Companies = companies;
		}

		if (request.Projects != null)
		{
			var projects = await db.Projects.Where(p => request.Projects.Contains(p.Id)).ToListAsync(cancellationToken);
			cv.Projects = projects;
		}

		if (request.Educations != null)
		{
			var educations = await db.Educations.Where(e => request.Educations.Contains(e.Id)).ToListAsync(cancellationToken);
			cv.Educations = educations;
		}

		if (request.Skills != null)
		{
			var skills = await db.Skills.Where(s => request.Skills.Contains(s.Id)).ToListAsync(cancellationToken);
			cv.Skills = skills;
		}

        await db.SaveChangesAsync(cancellationToken);
        return cv;
    }

    public async Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
		await using var db = _context;
		var cv = await db.Cvs.FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
        if (cv is null)
        {
            return false;
        }

		db.Cvs.Remove(cv);
		await db.SaveChangesAsync(cancellationToken);
        return true;
    }
}
