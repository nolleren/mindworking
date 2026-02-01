using GraphQL.Types;
using Mind.Application.Services;

namespace Mind.Api.GraphQL.Inputs;

public sealed class EntityConnectCreateInput
{
    public IReadOnlyList<Guid>? ConnectIds { get; init; }
    public IReadOnlyList<EntityCreateRequest>? Create { get; init; }
}
