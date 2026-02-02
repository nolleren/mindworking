namespace Mind.Application.Inputs;

public sealed class CvCreateInput
{
    public required string Name { get; init; }

    public List<CompanyCreateInput>? Companies { get; init; }
    public List<ProjectCreateInput>? Projects { get; init; }
    public List<EducationCreateInput>? Educations { get; init; }
    public List<SkillCreateInput>? Skills { get; init; }
}
