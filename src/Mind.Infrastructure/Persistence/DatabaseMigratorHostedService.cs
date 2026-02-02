using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace Mind.Infrastructure.Persistence;

internal sealed class DatabaseMigratorHostedService(
	IServiceProvider serviceProvider,
	IDbContextFactory<MindDbContext> dbFactory) : IHostedService
{
    public async Task StartAsync(CancellationToken cancellationToken)
    {
        using var scope = serviceProvider.CreateScope();
		await using var dbContext = await dbFactory.CreateDbContextAsync(cancellationToken);
		await dbContext.Database.MigrateAsync(cancellationToken);
    }

    public Task StopAsync(CancellationToken cancellationToken) => Task.CompletedTask;
}
