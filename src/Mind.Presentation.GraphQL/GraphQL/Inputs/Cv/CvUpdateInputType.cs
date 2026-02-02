using GraphQL.Types;
using Mind.Application.Inputs;

namespace Mind.Presentation.GraphQL.Inputs;

public sealed class CvUpdateInputType : InputObjectGraphType<CvUpdateInput>
{
    public CvUpdateInputType()
    {
        Name = "UpdateCvInput";

        Field(x => x.Id, type: typeof(NonNullGraphType<IdGraphType>));
        Field(x => x.Name, type: typeof(NonNullGraphType<StringGraphType>));
        Field(x => x.Companies, type: typeof(ListGraphType<NonNullGraphType<IdGraphType>>));
        Field(x => x.Projects, type: typeof(ListGraphType<NonNullGraphType<IdGraphType>>));
        Field(x => x.Educations, type: typeof(ListGraphType<NonNullGraphType<IdGraphType>>));
        Field(x => x.Skills, type: typeof(ListGraphType<NonNullGraphType<IdGraphType>>));
    }
}
