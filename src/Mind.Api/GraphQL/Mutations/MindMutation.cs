using GraphQL;
using GraphQL.Types;
using Mind.Api.GraphQL.Inputs;
using Mind.Api.GraphQL.Types;
using Mind.Application.Services;
using Mind.Core.Entities;

namespace Mind.Api.GraphQL.Mutations;

public sealed class MindMutation : ObjectGraphType
{
    public MindMutation()
    {
        Name = "Mutation";

        Field<NonNullGraphType<CvType>>("createCv")
            .Argument<NonNullGraphType<CreateCvInputType>>("input")
            .ResolveAsync(async context =>
            {
                var services = context.RequestServices ?? throw new InvalidOperationException("RequestServices is not available.");
                var input = context.GetArgument<CreateCvInput>("input");

                var request = new CreateCvRequest(
                    input.Name,
                    Map<Company>(input.Companies),
                    Map<Project>(input.Projects),
                    Map<Education>(input.Educations),
                    Map<Skill>(input.Skills));

                return await services.GetRequiredService<ICvService>().CreateAsync(request, context.CancellationToken);
            });
    }

    private static EntityConnectCreateRequest<TEntity>? Map<TEntity>(EntityConnectCreateInput? input)
        where TEntity : BaseEntity
    {
        if (input is null)
        {
            return null;
        }

        return new EntityConnectCreateRequest<TEntity>(
            input.ConnectIds,
            input.Create);
    }
}
