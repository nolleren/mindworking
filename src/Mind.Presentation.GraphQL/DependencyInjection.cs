using Mind.Presentation.GraphQL.DataLoaders;
using GraphQL;
using Microsoft.Extensions.DependencyInjection;

namespace Mind.Presentation.GraphQL;

public static class DependencyInjection
{
    public static IServiceCollection AddGraphQLPresentation(this IServiceCollection services, bool isDev)
    {
        services.AddGraphQL(graphQLBuilder =>
         {
             graphQLBuilder
                 .AddSystemTextJson()
                 .AddSchema<MindSchema>()
                 .AddGraphTypes(typeof(MindSchema).Assembly)
                 .AddDataLoader()
                 .AddErrorInfoProvider(options =>
                 {
                     options.ExposeExceptionDetails = isDev;
                 });
         });

        services.AddScoped(typeof(EntitiesByCvIdDataLoader<>));
        services.AddScoped(typeof(CvsByEntityIdDataLoader<>));
        return services;
    }
}
