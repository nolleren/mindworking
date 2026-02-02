using GraphQL.Types;

namespace Mind.Presentation.GraphQL.Mutations;

public sealed class MindMutation : ObjectGraphType
{
    public MindMutation()
    {
        Name = "Mutation";

        this.AddCvMutations();
        this.AddCompanyMutations();
        this.AddProjectMutations();
        this.AddEducationMutations();
        this.AddSkillMutations();
    }
}
