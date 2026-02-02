using GraphQL.Types;

namespace Mind.Presentation.GraphQL.Queries;

public sealed class MindQuery : ObjectGraphType
{
    public MindQuery()
    {
        Name = "Query";

        this.AddCvQueries();
        this.AddCompanyQueries();
        this.AddProjectQueries();
        this.AddEducationQueries();
        this.AddSkillQueries();
    }
}
