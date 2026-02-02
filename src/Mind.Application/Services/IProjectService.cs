using Mind.Core.Entities;
using Mind.Application.Inputs;

namespace Mind.Application.Services;

public interface IProjectService
{
    Task<IReadOnlyList<Project>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<Project?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<Project> CreateAsync(ProjectCreateInput input, CancellationToken cancellationToken = default);
    Task<Project> UpdateAsync(ProjectUpsertInput input, CancellationToken cancellationToken = default);
    Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default);
}
