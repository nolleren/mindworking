using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace Mind.Infrastructure.Persistence;

public sealed class MindDbContextFactory : IDesignTimeDbContextFactory<MindDbContext>
{
    public MindDbContext CreateDbContext(string[] args)
    {
        var optionsBuilder = new DbContextOptionsBuilder<MindDbContext>();

        var connectionString =
            Environment.GetEnvironmentVariable("ConnectionStrings__minddb") ??
            "Host=localhost;Port=5432;Database=minddb;Username=postgres;Password=postgres";

        optionsBuilder.UseNpgsql(connectionString);

        return new MindDbContext(optionsBuilder.Options);
    }
}
