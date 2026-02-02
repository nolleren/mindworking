using Microsoft.Extensions.DependencyInjection;
using Mind.Presentation.GraphQL.DataLoaders;

namespace Mind.Presentation.GraphQL;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddGraphQLPresentation(this IServiceCollection services)
    {
        services.AddScoped(typeof(EntitiesByCvIdDataLoader<>));
        services.AddScoped(typeof(CvsByEntityIdDataLoader<>));
        return services;
    }
}
