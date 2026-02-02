using GraphQL.Types;
using Mind.Application.Inputs;

namespace Mind.Presentation.GraphQL.Inputs;

public sealed class CvCreateInputType : InputObjectGraphType<CvCreateInput>
{
    public CvCreateInputType()
    {
        Name = "CreateCvInput";

        Field(x => x.Name, type: typeof(NonNullGraphType<StringGraphType>));
        Field(x => x.Companies, type: typeof(ListGraphType<NonNullGraphType<IdGraphType>>));
        Field(x => x.Projects, type: typeof(ListGraphType<NonNullGraphType<IdGraphType>>));
        Field(x => x.Educations, type: typeof(ListGraphType<NonNullGraphType<IdGraphType>>));
        Field(x => x.Skills, type: typeof(ListGraphType<NonNullGraphType<IdGraphType>>));
    }
}
