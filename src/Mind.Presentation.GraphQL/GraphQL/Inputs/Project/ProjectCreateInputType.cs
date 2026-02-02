using GraphQL.Types;
using Mind.Application.Inputs;

namespace Mind.Presentation.GraphQL.Inputs
{
    public class ProjectCreateInputType : InputObjectGraphType<ProjectCreateInput>
    {
        public ProjectCreateInputType()
        {
            Name = "ProjectCreateInput";

            Field(x => x.Name, type: typeof(NonNullGraphType<StringGraphType>));
            Field(x => x.StartDate, type: typeof(NonNullGraphType<DateGraphType>));
            Field(x => x.EndDate, type: typeof(NonNullGraphType<DateGraphType>));
            Field(x => x.Description, type: typeof(NonNullGraphType<StringGraphType>));
        }
    }
}
