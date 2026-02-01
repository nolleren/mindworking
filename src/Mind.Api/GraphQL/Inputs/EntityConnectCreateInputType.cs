using GraphQL.Types;

namespace Mind.Api.GraphQL.Inputs;

public sealed class EntityConnectCreateInputType : InputObjectGraphType<EntityConnectCreateInput>
{
    public EntityConnectCreateInputType()
    {
        Name = "EntityConnectCreateInput";

        Field(x => x.ConnectIds, type: typeof(ListGraphType<NonNullGraphType<IdGraphType>>));
        Field(x => x.Create, type: typeof(ListGraphType<NonNullGraphType<EntityCreateInputType>>));
    }
}
