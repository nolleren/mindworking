using GraphQL;
using GraphQL.Types;
using Mind.Api.GraphQL.Types;
using Mind.Application.Services;

namespace Mind.Api.GraphQL.Queries;

public sealed class MindQuery : ObjectGraphType
{
    public MindQuery()
    {
        Name = "Query";

        Field<ListGraphType<NonNullGraphType<CvType>>>("cvs")
            .ResolveAsync(async context =>
            {
                var services = context.RequestServices ?? throw new InvalidOperationException("RequestServices is not available.");
                return await services.GetRequiredService<ICvService>().GetAllAsync(context.CancellationToken);
            });

        Field<CvType>("cv")
            .Argument<NonNullGraphType<IdGraphType>>("id")
            .ResolveAsync(async context =>
            {
                var services = context.RequestServices ?? throw new InvalidOperationException("RequestServices is not available.");
                var id = context.GetArgument<Guid>("id");
                return await services.GetRequiredService<ICvService>().GetByIdAsync(id, context.CancellationToken);
            });

        Field<ListGraphType<NonNullGraphType<CompanyType>>>("companies")
            .ResolveAsync(async context =>
            {
                var services = context.RequestServices ?? throw new InvalidOperationException("RequestServices is not available.");
                return await services.GetRequiredService<ICompanyService>().GetAllAsync(context.CancellationToken);
            });
        Field<CompanyType>("company")
            .Argument<NonNullGraphType<IdGraphType>>("id")
            .ResolveAsync(async context =>
            {
                var services = context.RequestServices ?? throw new InvalidOperationException("RequestServices is not available.");
                var id = context.GetArgument<Guid>("id");
                return await services.GetRequiredService<ICompanyService>().GetByIdAsync(id, context.CancellationToken);
            });

        Field<ListGraphType<NonNullGraphType<ProjectType>>>("projects")
            .ResolveAsync(async context =>
            {
                var services = context.RequestServices ?? throw new InvalidOperationException("RequestServices is not available.");
                return await services.GetRequiredService<IProjectService>().GetAllAsync(context.CancellationToken);
            });
        Field<ProjectType>("project")
            .Argument<NonNullGraphType<IdGraphType>>("id")
            .ResolveAsync(async context =>
            {
                var services = context.RequestServices ?? throw new InvalidOperationException("RequestServices is not available.");
                var id = context.GetArgument<Guid>("id");
                return await services.GetRequiredService<IProjectService>().GetByIdAsync(id, context.CancellationToken);
            });

        Field<ListGraphType<NonNullGraphType<EducationType>>>("educations")
            .ResolveAsync(async context =>
            {
                var services = context.RequestServices ?? throw new InvalidOperationException("RequestServices is not available.");
                return await services.GetRequiredService<IEducationService>().GetAllAsync(context.CancellationToken);
            });

        Field<EducationType>("education")
            .Argument<NonNullGraphType<IdGraphType>>("id")
            .ResolveAsync(async context =>
            {
                var services = context.RequestServices ?? throw new InvalidOperationException("RequestServices is not available.");
                var id = context.GetArgument<Guid>("id");
                return await services.GetRequiredService<IEducationService>().GetByIdAsync(id, context.CancellationToken);
            });

        Field<ListGraphType<NonNullGraphType<SkillType>>>("skills")
            .ResolveAsync(async context =>
            {
                var services = context.RequestServices ?? throw new InvalidOperationException("RequestServices is not available.");
                return await services.GetRequiredService<ISkillService>().GetAllAsync(context.CancellationToken);
            });

        Field<SkillType>("skill")
            .Argument<NonNullGraphType<IdGraphType>>("id")
            .ResolveAsync(async context =>
            {
                var services = context.RequestServices ?? throw new InvalidOperationException("RequestServices is not available.");
                var id = context.GetArgument<Guid>("id");
                return await services.GetRequiredService<ISkillService>().GetByIdAsync(id, context.CancellationToken);
            });
    }
}
