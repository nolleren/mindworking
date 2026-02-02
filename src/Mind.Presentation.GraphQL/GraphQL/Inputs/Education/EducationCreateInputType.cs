using GraphQL.Types;
using Mind.Application.Inputs;

namespace Mind.Presentation.GraphQL.Inputs
{
    public class EducationCreateInputType : InputObjectGraphType<EducationCreateInput>
    {
        public EducationCreateInputType()
        {
            Name = "EducationCreateInput";

            Field(x => x.Name, type: typeof(NonNullGraphType<StringGraphType>));
            Field(x => x.Address, type: typeof(NonNullGraphType<StringGraphType>));
            Field(x => x.ZipCode, type: typeof(NonNullGraphType<StringGraphType>));
            Field(x => x.City, type: typeof(NonNullGraphType<StringGraphType>));
            Field(x => x.Description, type: typeof(NonNullGraphType<StringGraphType>));
        }
    }
}
