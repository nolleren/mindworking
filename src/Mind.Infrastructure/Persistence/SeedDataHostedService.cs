using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Hosting;
using Mind.Core.Entities;

namespace Mind.Infrastructure.Persistence;

public class SeedDataHostedService(IDbContextFactory<MindDbContext> factory) : IHostedService
{
    public async Task StartAsync(CancellationToken cancellationToken)
    {
        await using var db = factory.CreateDbContext();
        if (await db.Cvs.AnyAsync(cancellationToken)) return;

        // Seed 20 companies, 20 projects, 20 educations, 20 skills
        var companies = Enumerable.Range(1, 20).Select(i => new Company
        {
            Id = Guid.NewGuid(),
            Name = $"Company {i}",
            Address = $"Address {i}",
            ZipCode = $"100{i}",
            City = $"City {i}",
            Description = $"Description {i}"
        }).ToList();
        var projects = Enumerable.Range(1, 20).Select(i => new Project
        {
            Id = Guid.NewGuid(),
            Name = $"Project {i}",
            StartDate = DateTime.UtcNow.AddYears(-i),
            EndDate = DateTime.UtcNow.AddYears(-i + 1),
            Description = $"Project {i} description"
        }).ToList();
        var educations = Enumerable.Range(1, 20).Select(i => new Education
        {
            Id = Guid.NewGuid(),
            Name = $"Education {i}",
            Address = $"Edu Address {i}",
            ZipCode = $"200{i}",
            City = $"Edu City {i}",
            Description = $"Education {i} description"
        }).ToList();
        var skills = Enumerable.Range(1, 20).Select(i => new Skill
        {
            Id = Guid.NewGuid(),
            Name = $"Skill {i}",
            Description = $"Skill {i} description",
            LevelOfMastery = SkillMasteryLevel.Medium
        }).ToList();

        db.Companies.AddRange(companies);
        db.Projects.AddRange(projects);
        db.Educations.AddRange(educations);
        db.Skills.AddRange(skills);

        // Seed 5 CVs with mixed relations
        var random = new Random();
        var cvs = Enumerable.Range(1, 5).Select(i => new Cv
        {
            Id = Guid.NewGuid(),
            Name = $"CV {i}",
            Companies = companies.OrderBy(_ => random.Next()).Take(random.Next(2, 8)).ToList(),
            Projects = projects.OrderBy(_ => random.Next()).Take(random.Next(2, 8)).ToList(),
            Educations = educations.OrderBy(_ => random.Next()).Take(random.Next(2, 8)).ToList(),
            Skills = skills.OrderBy(_ => random.Next()).Take(random.Next(2, 8)).ToList(),
        }).ToList();
        db.Cvs.AddRange(cvs);

        await db.SaveChangesAsync(cancellationToken);
    }

    public Task StopAsync(CancellationToken cancellationToken) => Task.CompletedTask;
}
