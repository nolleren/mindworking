using Mind.Core.Entities;
using Mind.Application.Inputs;

namespace Mind.Application.Services;

public interface ISkillService
{
    Task<IReadOnlyList<Skill>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<Skill?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<Skill>> CreateSkillsAsync(IReadOnlyList<SkillCreateInput> createRequests, CancellationToken cancellationToken = default);
    Task<Skill> CreateAsync(SkillCreateInput input, CancellationToken cancellationToken = default);
    Task<Skill> UpdateAsync(SkillUpsertInput input, CancellationToken cancellationToken = default);
    Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default);
}
