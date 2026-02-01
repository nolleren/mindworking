using Microsoft.EntityFrameworkCore;
using Mind.Application.Services;
using Mind.Core.Entities;
using Mind.Infrastructure.Persistence;

namespace Mind.Infrastructure.Services;

internal sealed class CvService : ICvService
{
    private readonly MindDbContext _db;
    private readonly ICompanyService _companyService;
    private readonly IProjectService _projectService;
    private readonly IEducationService _educationService;
    private readonly ISkillService _skillService;

    public CvService(
        MindDbContext db,
        ICompanyService companyService,
        IProjectService projectService,
        IEducationService educationService,
        ISkillService skillService)
    {
        _db = db;
        _companyService = companyService;
        _projectService = projectService;
        _educationService = educationService;
        _skillService = skillService;
    }

    public async Task<IReadOnlyList<Cv>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return await _db.Cvs
            .AsNoTracking()
            .OrderBy(x => x.Name)
            .ToListAsync(cancellationToken);
    }

    public async Task<Cv?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _db.Cvs
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
    }

    public async Task<IReadOnlyDictionary<Guid, IReadOnlyList<Cv>>> GetByCompanyIdsAsync(
        IReadOnlyCollection<Guid> companyIds,
        CancellationToken cancellationToken = default)
    {
        if (companyIds.Count == 0)
        {
            return new Dictionary<Guid, IReadOnlyList<Cv>>();
        }

        var ids = companyIds.Distinct().ToArray();
        var result = ids.ToDictionary(x => x, _ => (IReadOnlyList<Cv>)Array.Empty<Cv>());

        var companies = await _db.Companies
            .AsNoTracking()
            .Where(x => ids.Contains(x.Id))
            .Include(x => x.Cvs)
            .ToListAsync(cancellationToken);

        foreach (var company in companies)
        {
            result[company.Id] = company.Cvs
                .OrderBy(x => x.Name)
                .ToList();
        }

        return result;
    }

    public async Task<IReadOnlyDictionary<Guid, IReadOnlyList<Cv>>> GetByProjectIdsAsync(
        IReadOnlyCollection<Guid> projectIds,
        CancellationToken cancellationToken = default)
    {
        if (projectIds.Count == 0)
        {
            return new Dictionary<Guid, IReadOnlyList<Cv>>();
        }

        var ids = projectIds.Distinct().ToArray();
        var result = ids.ToDictionary(x => x, _ => (IReadOnlyList<Cv>)Array.Empty<Cv>());

        var projects = await _db.Projects
            .AsNoTracking()
            .Where(x => ids.Contains(x.Id))
            .Include(x => x.Cvs)
            .ToListAsync(cancellationToken);

        foreach (var project in projects)
        {
            result[project.Id] = project.Cvs
                .OrderBy(x => x.Name)
                .ToList();
        }

        return result;
    }

    public async Task<IReadOnlyDictionary<Guid, IReadOnlyList<Cv>>> GetByEducationIdsAsync(
        IReadOnlyCollection<Guid> educationIds,
        CancellationToken cancellationToken = default)
    {
        if (educationIds.Count == 0)
        {
            return new Dictionary<Guid, IReadOnlyList<Cv>>();
        }

        var ids = educationIds.Distinct().ToArray();
        var result = ids.ToDictionary(x => x, _ => (IReadOnlyList<Cv>)Array.Empty<Cv>());

        var educations = await _db.Educations
            .AsNoTracking()
            .Where(x => ids.Contains(x.Id))
            .Include(x => x.Cvs)
            .ToListAsync(cancellationToken);

        foreach (var education in educations)
        {
            result[education.Id] = education.Cvs
                .OrderBy(x => x.Name)
                .ToList();
        }

        return result;
    }

    public async Task<IReadOnlyDictionary<Guid, IReadOnlyList<Cv>>> GetBySkillIdsAsync(
        IReadOnlyCollection<Guid> skillIds,
        CancellationToken cancellationToken = default)
    {
        if (skillIds.Count == 0)
        {
            return new Dictionary<Guid, IReadOnlyList<Cv>>();
        }

        var ids = skillIds.Distinct().ToArray();
        var result = ids.ToDictionary(x => x, _ => (IReadOnlyList<Cv>)Array.Empty<Cv>());

        var skills = await _db.Skills
            .AsNoTracking()
            .Where(x => ids.Contains(x.Id))
            .Include(x => x.Cvs)
            .ToListAsync(cancellationToken);

        foreach (var skill in skills)
        {
            result[skill.Id] = skill.Cvs
                .OrderBy(x => x.Name)
                .ToList();
        }

        return result;
    }

    public async Task<Cv> CreateAsync(CreateCvRequest request, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(request.Name))
        {
            throw new ArgumentException("CV name is required", nameof(request));
        }

        var cv = new Cv { Name = request.Name.Trim() };

        await AttachCompaniesAsync(cv, request.Companies, cancellationToken);
        await AttachProjectsAsync(cv, request.Projects, cancellationToken);
        await AttachEducationsAsync(cv, request.Educations, cancellationToken);
        await AttachSkillsAsync(cv, request.Skills, cancellationToken);

        _db.Cvs.Add(cv);
        await _db.SaveChangesAsync(cancellationToken);

        return cv;
    }

    private async Task AttachCompaniesAsync(Cv cv, EntityConnectCreateRequest<Company>? request, CancellationToken cancellationToken)
    {
        if (request is null)
        {
            return;
        }

        if (request.ConnectIds is { Count: > 0 })
        {
            var ids = request.ConnectIds.Distinct().ToArray();
            var existing = await _companyService.GetByIdsAsync(ids, cancellationToken);

            var missing = ids.Where(id => !existing.ContainsKey(id)).ToArray();
            if (missing.Length > 0)
            {
                throw new InvalidOperationException($"Unknown company id(s): {string.Join(", ", missing)}");
            }

            _db.AttachRange(existing.Values);
            foreach (var entity in existing.Values)
            {
                cv.Companies.Add(entity);
            }
        }

        if (request.Create is { Count: > 0 })
        {
            var created = await _companyService.CreateManyAsync(request.Create, cancellationToken);
            foreach (var entity in created)
            {
                cv.Companies.Add(entity);
            }
        }
    }

    private async Task AttachProjectsAsync(Cv cv, EntityConnectCreateRequest<Project>? request, CancellationToken cancellationToken)
    {
        if (request is null)
        {
            return;
        }

        if (request.ConnectIds is { Count: > 0 })
        {
            var ids = request.ConnectIds.Distinct().ToArray();
            var existing = await _projectService.GetByIdsAsync(ids, cancellationToken);

            var missing = ids.Where(id => !existing.ContainsKey(id)).ToArray();
            if (missing.Length > 0)
            {
                throw new InvalidOperationException($"Unknown project id(s): {string.Join(", ", missing)}");
            }

            _db.AttachRange(existing.Values);
            foreach (var entity in existing.Values)
            {
                cv.Projects.Add(entity);
            }
        }

        if (request.Create is { Count: > 0 })
        {
            var created = await _projectService.CreateManyAsync(request.Create, cancellationToken);
            foreach (var entity in created)
            {
                cv.Projects.Add(entity);
            }
        }
    }

    private async Task AttachEducationsAsync(Cv cv, EntityConnectCreateRequest<Education>? request, CancellationToken cancellationToken)
    {
        if (request is null)
        {
            return;
        }

        if (request.ConnectIds is { Count: > 0 })
        {
            var ids = request.ConnectIds.Distinct().ToArray();
            var existing = await _educationService.GetByIdsAsync(ids, cancellationToken);

            var missing = ids.Where(id => !existing.ContainsKey(id)).ToArray();
            if (missing.Length > 0)
            {
                throw new InvalidOperationException($"Unknown education id(s): {string.Join(", ", missing)}");
            }

            _db.AttachRange(existing.Values);
            foreach (var entity in existing.Values)
            {
                cv.Educations.Add(entity);
            }
        }

        if (request.Create is { Count: > 0 })
        {
            var created = await _educationService.CreateManyAsync(request.Create, cancellationToken);
            foreach (var entity in created)
            {
                cv.Educations.Add(entity);
            }
        }
    }

    private async Task AttachSkillsAsync(Cv cv, EntityConnectCreateRequest<Skill>? request, CancellationToken cancellationToken)
    {
        if (request is null)
        {
            return;
        }

        if (request.ConnectIds is { Count: > 0 })
        {
            var ids = request.ConnectIds.Distinct().ToArray();
            var existing = await _skillService.GetByIdsAsync(ids, cancellationToken);

            var missing = ids.Where(id => !existing.ContainsKey(id)).ToArray();
            if (missing.Length > 0)
            {
                throw new InvalidOperationException($"Unknown skill id(s): {string.Join(", ", missing)}");
            }

            _db.AttachRange(existing.Values);
            foreach (var entity in existing.Values)
            {
                cv.Skills.Add(entity);
            }
        }

        if (request.Create is { Count: > 0 })
        {
            var created = await _skillService.CreateManyAsync(request.Create, cancellationToken);
            foreach (var entity in created)
            {
                cv.Skills.Add(entity);
            }
        }
    }
}
