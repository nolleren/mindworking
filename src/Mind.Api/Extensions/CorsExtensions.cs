using Microsoft.Extensions.DependencyInjection;
using Microsoft.AspNetCore.Builder;

namespace Mind.Api.Extensions;

public static class CorsExtensions
{
    public const string DefaultPolicyName = "MindCors";

    public static IServiceCollection AddMindCors(this IServiceCollection services)
    {
        services.AddCors(options =>
        {
            options.AddPolicy(DefaultPolicyName, policy =>
            {
                policy
                    .WithOrigins(
                        "https://localhost:5173",
                        "http://localhost:5173",
                        "https://localhost:5174",
                        "http://localhost:5174")
                    .AllowAnyHeader()
                    .AllowAnyMethod();
            });
        });

        return services;
    }

    public static WebApplication UseMindCors(this WebApplication app)
    {
        app.UseCors(DefaultPolicyName);
        return app;
    }
}
