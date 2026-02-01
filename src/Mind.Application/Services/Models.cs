using Mind.Core.Entities;

namespace Mind.Application.Services;

public sealed record CreateCvRequest(
    string Name,
    EntityConnectCreateRequest<Company>? Companies,
    EntityConnectCreateRequest<Project>? Projects,
    EntityConnectCreateRequest<Education>? Educations,
    EntityConnectCreateRequest<Skill>? Skills);

public sealed record EntityConnectCreateRequest<TEntity>(
    IReadOnlyList<Guid>? ConnectIds,
    IReadOnlyList<EntityCreateRequest>? Create)
    where TEntity : BaseEntity;

public sealed record EntityCreateRequest(
    string Name,
    string? Address = null,
    string? ZipCode = null,
    string? City = null,
    string? Description = null,
    DateTime? StartDate = null,
    DateTime? EndDate = null,
    SkillMasteryLevel? LevelOfMastery = null);
