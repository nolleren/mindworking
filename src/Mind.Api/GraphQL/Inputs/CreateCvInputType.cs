using GraphQL.Types;

namespace Mind.Api.GraphQL.Inputs;

public sealed class CreateCvInputType : InputObjectGraphType<CreateCvInput>
{
    public CreateCvInputType()
    {
        Name = "CreateCvInput";

        Field(x => x.Name, type: typeof(NonNullGraphType<StringGraphType>));
        Field(x => x.Companies, type: typeof(EntityConnectCreateInputType));
        Field(x => x.Projects, type: typeof(EntityConnectCreateInputType));
        Field(x => x.Educations, type: typeof(EntityConnectCreateInputType));
        Field(x => x.Skills, type: typeof(EntityConnectCreateInputType));
    }
}
