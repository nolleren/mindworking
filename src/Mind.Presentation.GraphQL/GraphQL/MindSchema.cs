using GraphQL.Types;
using Mind.Presentation.GraphQL.Mutations;
using Mind.Presentation.GraphQL.Queries;

namespace Mind.Presentation.GraphQL;

public sealed class MindSchema : Schema
{
    public MindSchema(IServiceProvider serviceProvider) : base(serviceProvider)
    {
        Query = serviceProvider.GetRequiredService<MindQuery>();
        Mutation = serviceProvider.GetRequiredService<MindMutation>();
    }
}
