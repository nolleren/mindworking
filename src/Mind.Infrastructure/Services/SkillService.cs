using Microsoft.EntityFrameworkCore;
using Mind.Application.Inputs;
using Mind.Application.Services;
using Mind.Core.Entities;
using Mind.Infrastructure.Persistence;

namespace Mind.Infrastructure.Services;

internal sealed class SkillService(MindDbContext db) : ISkillService
{
    public async Task<IReadOnlyList<Skill>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return await db.Skills
            .AsNoTracking()
            .OrderBy(x => x.Name)
            .ToListAsync(cancellationToken);
    }

    public async Task<Skill?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await db.Skills
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
    }

    public Task<IReadOnlyList<Skill>> CreateSkillsAsync(IReadOnlyList<SkillCreateInput> createRequests, CancellationToken cancellationToken = default)
    {
        var created = createRequests
            .Select(x => new Skill
            {
                Name = x.Name.Trim(),
                Description = x.Description.Trim(),
                LevelOfMastery = x.LevelOfMastery,
            })
            .ToList();

        db.Skills.AddRange(created);

        return Task.FromResult((IReadOnlyList<Skill>)created);
    }

    public async Task<Skill> CreateAsync(SkillCreateInput input, CancellationToken cancellationToken = default)
    {
        var entity = new Skill
        {
            Name = input.Name.Trim(),
            Description = input.Description.Trim(),
            LevelOfMastery = input.LevelOfMastery,
        };

        db.Skills.Add(entity);
        await db.SaveChangesAsync(cancellationToken);
        return entity;
    }

    public async Task<Skill> UpdateAsync(SkillUpsertInput input, CancellationToken cancellationToken = default)
    {
        if (input.Id == null)
        {
            throw new ArgumentException("Id is required for update.", nameof(input));
        }

        var id = input.Id.Value;
        var entity = await db.Skills.FirstOrDefaultAsync(x => x.Id == id, cancellationToken)
            ?? throw new InvalidOperationException($"Unknown skill id '{id}'.");

        entity.Name = input.Name.Trim();
        entity.Description = input.Description.Trim();
        entity.LevelOfMastery = input.LevelOfMastery;

        await db.SaveChangesAsync(cancellationToken);
        return entity;
    }

    public async Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var entity = await db.Skills.FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
        if (entity is null)
        {
            return false;
        }

        var hasDependencies = await db.Entry(entity).Collection(x => x.Cvs).Query().AnyAsync(cancellationToken);
        if (hasDependencies)
        {
            throw new InvalidOperationException("Cannot delete skill because it is linked to one or more CVs.");
        }

        db.Skills.Remove(entity);
        await db.SaveChangesAsync(cancellationToken);
        return true;
    }
}
