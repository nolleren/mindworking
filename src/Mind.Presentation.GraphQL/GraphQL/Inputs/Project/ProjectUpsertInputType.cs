using GraphQL.Types;
using Mind.Application.Inputs;

namespace Mind.Presentation.GraphQL.Inputs;

public sealed class ProjectUpsertInputType : InputObjectGraphType<ProjectUpsertInput>
{
    public ProjectUpsertInputType()
    {
        Name = "ProjectUpsertInput";

        Field(x => x.Id, type: typeof(IdGraphType));
        Field(x => x.Name, type: typeof(NonNullGraphType<StringGraphType>));
        Field(x => x.StartDate, type: typeof(NonNullGraphType<DateGraphType>));
        Field(x => x.EndDate, type: typeof(NonNullGraphType<DateGraphType>));
        Field(x => x.Description, type: typeof(NonNullGraphType<StringGraphType>));
    }
}
