using GraphQL.Types;
using Mind.Api.GraphQL.Mutations;
using Mind.Api.GraphQL.Queries;

namespace Mind.Api.GraphQL;

public sealed class MindSchema : Schema
{
    public MindSchema(IServiceProvider serviceProvider) : base(serviceProvider)
    {
        Query = serviceProvider.GetRequiredService<MindQuery>();
        Mutation = serviceProvider.GetRequiredService<MindMutation>();
    }
}
