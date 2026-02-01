using GraphQL.Types;
using Mind.Core.Entities;

namespace Mind.Api.GraphQL.Types;

public sealed class BaseEntityInterface : InterfaceGraphType<BaseEntity>
{
    public BaseEntityInterface()
    {
        Name = "BaseEntity";

        Field<NonNullGraphType<IdGraphType>>("id");
        Field<NonNullGraphType<DateTimeGraphType>>("createdAt");
        Field<NonNullGraphType<DateTimeGraphType>>("updatedAt");
    }
}
