namespace Mind.Api.GraphQL.Inputs;

public sealed class CreateCvInput
{
    public string Name { get; init; } = string.Empty;
    public EntityConnectCreateInput? Companies { get; init; }
    public EntityConnectCreateInput? Projects { get; init; }
    public EntityConnectCreateInput? Educations { get; init; }
    public EntityConnectCreateInput? Skills { get; init; }
}
