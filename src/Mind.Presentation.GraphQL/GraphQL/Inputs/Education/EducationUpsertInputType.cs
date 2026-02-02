using GraphQL.Types;
using Mind.Application.Inputs;

namespace Mind.Presentation.GraphQL.Inputs;

public sealed class EducationUpsertInputType : InputObjectGraphType<EducationUpsertInput>
{
    public EducationUpsertInputType()
    {
        Name = "EducationUpsertInput";

        Field(x => x.Id, type: typeof(NonNullGraphType<IdGraphType>));
        Field(x => x.Name, type: typeof(NonNullGraphType<StringGraphType>));
        Field(x => x.Address, type: typeof(NonNullGraphType<StringGraphType>));
        Field(x => x.ZipCode, type: typeof(NonNullGraphType<StringGraphType>));
        Field(x => x.City, type: typeof(NonNullGraphType<StringGraphType>));
        Field(x => x.Description, type: typeof(NonNullGraphType<StringGraphType>));
    }
}
