using Microsoft.EntityFrameworkCore;
using Mind.Infrastructure;
using Mind.Presentation.GraphQL;
using Mind.Api.Extensions;

var builder = WebApplication.CreateBuilder(args);

builder.AddServiceDefaults();

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

builder.Services.AddGraphQLPresentation(builder.Environment.IsDevelopment());

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
