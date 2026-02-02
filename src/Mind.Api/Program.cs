using GraphQL;
using GraphQL.Server.Ui.GraphiQL;
using Microsoft.EntityFrameworkCore;
using Mind.Application;
using Mind.Core;
using Mind.Infrastructure;
using Mind.Api.Cors;
using Mind.Presentation.GraphQL;

var builder = WebApplication.CreateBuilder(args);

builder.AddServiceDefaults();

// Add services to the container.
builder.Services.AddApplication();

builder.Services.AddMindCors();

builder.Services.AddInfrastructure(options =>
{
    var connectionString = builder.Configuration.GetConnectionString("minddb");
    if (string.IsNullOrWhiteSpace(connectionString))
    {
        throw new InvalidOperationException("Missing connection string 'minddb'. Run via AppHost, or set ConnectionStrings:minddb.");
    }

    options.UseNpgsql(connectionString);
});

builder.Services.AddGraphQLPresentation();

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

app.UseMindCors();

app.UseGraphQL<MindSchema>("/graphql");

if (app.Environment.IsDevelopment())
{
    app.UseGraphQLGraphiQL();
}

app.Run();
