using Mind.Core.Entities;

namespace Mind.Application.Services;

public interface ICvService
{
    Task<IReadOnlyList<Cv>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<Cv?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);

    Task<IReadOnlyDictionary<Guid, IReadOnlyList<Cv>>> GetByCompanyIdsAsync(IReadOnlyCollection<Guid> companyIds, CancellationToken cancellationToken = default);
    Task<IReadOnlyDictionary<Guid, IReadOnlyList<Cv>>> GetByProjectIdsAsync(IReadOnlyCollection<Guid> projectIds, CancellationToken cancellationToken = default);
    Task<IReadOnlyDictionary<Guid, IReadOnlyList<Cv>>> GetByEducationIdsAsync(IReadOnlyCollection<Guid> educationIds, CancellationToken cancellationToken = default);
    Task<IReadOnlyDictionary<Guid, IReadOnlyList<Cv>>> GetBySkillIdsAsync(IReadOnlyCollection<Guid> skillIds, CancellationToken cancellationToken = default);

    Task<Cv> CreateAsync(CreateCvRequest request, CancellationToken cancellationToken = default);
}
