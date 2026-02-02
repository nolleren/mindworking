using Microsoft.EntityFrameworkCore;
using Mind.Application.Inputs;
using Mind.Application.Services;
using Mind.Core.Entities;
using Mind.Infrastructure.Persistence;

namespace Mind.Infrastructure.Services;

internal sealed class CvService(
    MindDbContext db,
    ICompanyService companyService,
    IProjectService projectService,
    IEducationService educationService,
    ISkillService skillService) : ICvService
{
    public async Task<IReadOnlyList<Cv>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return await db.Cvs
            .AsNoTracking()
            .OrderBy(x => x.Name)
            .ToListAsync(cancellationToken);
    }

    public async Task<Cv?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await db.Cvs
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
    }

    public async Task<Cv> CreateAsync(CvCreateInput request, CancellationToken cancellationToken = default)
    {
        var cv = new Cv { Name = request.Name.Trim() };

        if (request.Companies?.Count > 0)
        {
            var created = await companyService.CreateCompaniesAsync(request.Companies, cancellationToken);
            foreach (var entity in created)
            {
                cv.Companies.Add(entity);
            }
        }

        if (request.Projects?.Count > 0)
        {
            var created = await projectService.CreateProjectsAsync(request.Projects, cancellationToken);
            foreach (var entity in created)
            {
                cv.Projects.Add(entity);
            }
        }

        if (request.Educations?.Count > 0)
        {
            var created = await educationService.CreateEducationsAsync(request.Educations, cancellationToken);
            foreach (var entity in created)
            {
                cv.Educations.Add(entity);
            }
        }

        if (request.Skills?.Count > 0)
        {
            var created = await skillService.CreateSkillsAsync(request.Skills, cancellationToken);
            foreach (var entity in created)
            {
                cv.Skills.Add(entity);
            }
        }

        db.Cvs.Add(cv);
        await db.SaveChangesAsync(cancellationToken);

        return cv;
    }

    public async Task<Cv> UpdateAsync(CvUpdateInput request, CancellationToken cancellationToken = default)
    {
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

        if (request.Name is not null)
        {
            if (string.IsNullOrWhiteSpace(request.Name))
            {
                throw new ArgumentException("CV name cannot be empty.", nameof(request));
            }

            cv.Name = request.Name.Trim();
        }

        await ApplyCompaniesAsync(cv, request.Companies, cancellationToken);
        await ApplyProjectsAsync(cv, request.Projects, cancellationToken);
        await ApplyEducationsAsync(cv, request.Educations, cancellationToken);
        await ApplySkillsAsync(cv, request.Skills, cancellationToken);

        await db.SaveChangesAsync(cancellationToken);
        return cv;
    }

    public async Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var cv = await db.Cvs.FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
        if (cv is null)
        {
            return false;
        }

        db.Cvs.Remove(cv);
        await db.SaveChangesAsync(cancellationToken);
        return true;
    }

    private async Task ApplyCompaniesAsync(Cv cv, List<CompanyUpsertInput>? inputs, CancellationToken cancellationToken)
    {
        if (inputs is null)
        {
            return;
        }

        var desired = new List<Company>();
        foreach (var input in inputs)
        {
            Company entity;

            if (input.Id != null)
            {
                var id = input.Id.Value;
                entity = await db.Companies.FirstOrDefaultAsync(x => x.Id == id, cancellationToken)
                    ?? throw new InvalidOperationException($"Unknown company id '{id}'.");

                entity.Name = input.Name.Trim();
                entity.Address = input.Address.Trim();
                entity.ZipCode = input.ZipCode.Trim();
                entity.City = input.City.Trim();
                entity.Description = input.Description.Trim();
            }
            else
            {
                entity = new Company
                {
                    Name = input.Name.Trim(),
                    Address = input.Address.Trim(),
                    ZipCode = input.ZipCode.Trim(),
                    City = input.City.Trim(),
                    Description = input.Description.Trim(),
                };

                db.Companies.Add(entity);
            }

            desired.Add(entity);
        }

        cv.Companies.Clear();
        foreach (var entity in desired.GroupBy(x => x.Id).Select(g => g.First()))
        {
            cv.Companies.Add(entity);
        }
    }

    private async Task ApplyProjectsAsync(Cv cv, List<ProjectUpsertInput>? inputs, CancellationToken cancellationToken)
    {
        if (inputs is null)
        {
            return;
        }

        var desired = new List<Project>();
        foreach (var input in inputs)
        {
            Project entity;

            if (input.Id != null)
            {
                var id = input.Id.Value;
                entity = await db.Projects.FirstOrDefaultAsync(x => x.Id == id, cancellationToken)
                    ?? throw new InvalidOperationException($"Unknown project id '{id}'.");

                entity.Name = input.Name.Trim();
                entity.StartDate = input.StartDate;
                entity.EndDate = input.EndDate;
                entity.Description = input.Description.Trim();
            }
            else
            {
                entity = new Project
                {
                    Name = input.Name.Trim(),
                    StartDate = input.StartDate,
                    EndDate = input.EndDate,
                    Description = input.Description.Trim(),
                };

                db.Projects.Add(entity);
            }

            desired.Add(entity);
        }

        cv.Projects.Clear();
        foreach (var entity in desired.GroupBy(x => x.Id).Select(g => g.First()))
        {
            cv.Projects.Add(entity);
        }
    }

    private async Task ApplyEducationsAsync(Cv cv, List<EducationUpsertInput>? inputs, CancellationToken cancellationToken)
    {
        if (inputs is null)
        {
            return;
        }

        var desired = new List<Education>();
        foreach (var input in inputs)
        {
            Education entity;

            if (input.Id != null)
            {
                var id = input.Id.Value;
                entity = await db.Educations.FirstOrDefaultAsync(x => x.Id == id, cancellationToken)
                    ?? throw new InvalidOperationException($"Unknown education id '{id}'.");

                entity.Name = input.Name.Trim();
                entity.Address = input.Address.Trim();
                entity.ZipCode = input.ZipCode.Trim();
                entity.City = input.City.Trim();
                entity.Description = input.Description.Trim();
            }
            else
            {
                entity = new Education
                {
                    Name = input.Name.Trim(),
                    Address = input.Address.Trim(),
                    ZipCode = input.ZipCode.Trim(),
                    City = input.City.Trim(),
                    Description = input.Description.Trim(),
                };

                db.Educations.Add(entity);
            }

            desired.Add(entity);
        }

        cv.Educations.Clear();
        foreach (var entity in desired.GroupBy(x => x.Id).Select(g => g.First()))
        {
            cv.Educations.Add(entity);
        }
    }

    private async Task ApplySkillsAsync(Cv cv, List<SkillUpsertInput>? inputs, CancellationToken cancellationToken)
    {
        if (inputs is null)
        {
            return;
        }

        var desired = new List<Skill>();
        foreach (var input in inputs)
        {
            Skill entity;

            if (input.Id != null)
            {
                var id = input.Id.Value;
                entity = await db.Skills.FirstOrDefaultAsync(x => x.Id == id, cancellationToken)
                    ?? throw new InvalidOperationException($"Unknown skill id '{id}'.");

                entity.Name = input.Name.Trim();
                entity.Description = input.Description.Trim();
                entity.LevelOfMastery = input.LevelOfMastery;
            }
            else
            {
                entity = new Skill
                {
                    Name = input.Name.Trim(),
                    Description = input.Description.Trim(),
                    LevelOfMastery = input.LevelOfMastery,
                };

                db.Skills.Add(entity);
            }

            desired.Add(entity);
        }

        cv.Skills.Clear();
        foreach (var entity in desired.GroupBy(x => x.Id).Select(g => g.First()))
        {
            cv.Skills.Add(entity);
        }
    }
}
