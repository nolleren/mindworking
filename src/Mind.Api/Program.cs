using GraphQL;
using GraphQL.Server.Ui.GraphiQL;
using Microsoft.EntityFrameworkCore;
using Mind.Api.GraphQL;
using Mind.Api.GraphQL.DataLoaders;
using Mind.Application;
using Mind.Core;
using Mind.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

builder.AddServiceDefaults();

// Add services to the container.
builder.Services.AddCore();
builder.Services.AddApplication();

builder.Services.AddInfrastructure(options =>
{
    var connectionString = builder.Configuration.GetConnectionString("minddb");
    if (string.IsNullOrWhiteSpace(connectionString))
    {
        throw new InvalidOperationException("Missing connection string 'minddb'. Run via AppHost, or set ConnectionStrings:minddb.");
    }

    options.UseNpgsql(connectionString);
});

builder.Services.AddScoped(typeof(EntitiesByCvIdDataLoader<>));
builder.Services.AddScoped(typeof(CvsByEntityIdDataLoader<>));

builder.Services
    .AddGraphQL(graphQLBuilder =>
    {
        graphQLBuilder
            .AddSystemTextJson()
            .AddSchema<MindSchema>()
            .AddGraphTypes(typeof(MindSchema).Assembly)
            .AddDataLoader()
            .AddErrorInfoProvider(options =>
            {
                options.ExposeExceptionDetails = builder.Environment.IsDevelopment();
            });
    });

var app = builder.Build();

app.MapDefaultEndpoints();

// Configure the HTTP request pipeline.

app.UseHttpsRedirection();

app.UseGraphQL<MindSchema>("/graphql");
if (app.Environment.IsDevelopment())
{
    app.UseGraphQLGraphiQL(
        "/ui/graphiql",
        new GraphiQLOptions { GraphQLEndPoint = "/graphql" });
}

var summaries = new[]
{
    "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
};

app.MapGet("/weatherforecast", () =>
{
    var forecast =  Enumerable.Range(1, 5).Select(index =>
        new WeatherForecast
        (
            DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
            Random.Shared.Next(-20, 55),
            summaries[Random.Shared.Next(summaries.Length)]
        ))
        .ToArray();
    return forecast;
});

app.Run();

record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}
