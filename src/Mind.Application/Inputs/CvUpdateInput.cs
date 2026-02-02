namespace Mind.Application.Inputs;

public sealed class CvUpdateInput
{
    public required Guid Id { get; init; }

    public string? Name { get; init; }

    // If null: no change. If provided (even empty list): replace relation to match.
    public List<CompanyUpsertInput>? Companies { get; init; }
    public List<ProjectUpsertInput>? Projects { get; init; }
    public List<EducationUpsertInput>? Educations { get; init; }
    public List<SkillUpsertInput>? Skills { get; init; }
}
