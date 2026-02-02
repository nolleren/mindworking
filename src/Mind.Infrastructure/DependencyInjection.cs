using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Mind.Application.Services;
using Mind.Infrastructure.Persistence;
using Mind.Infrastructure.Services;

namespace Mind.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services,
        Action<DbContextOptionsBuilder> configureDb)
    {
        services.AddPooledDbContextFactory<MindDbContext>(configureDb);
        services.AddScoped<ICvService, CvService>();
        services.AddScoped<ICompanyService, CompanyService>();
        services.AddScoped<IProjectService, ProjectService>();
        services.AddScoped<IEducationService, EducationService>();
        services.AddScoped<ISkillService, SkillService>();

        services.AddScoped(typeof(IEntitiesByCvIdsService<>), typeof(EntitiesByCvIdsService<>));
        services.AddScoped(typeof(ICvsByEntityIdsService<>), typeof(CvsByEntityIdsService<>));

        services.AddHostedService<DatabaseMigratorHostedService>();
        return services;
    }
}
