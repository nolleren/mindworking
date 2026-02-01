using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Mind.Core.Entities;

namespace Mind.Infrastructure.Persistence.Configurations;

public sealed class ProjectConfiguration : IEntityTypeConfiguration<Project>
{
    public void Configure(EntityTypeBuilder<Project> builder)
    {
        builder.ToTable("Projects");
        builder.ConfigureBaseEntity();

        builder.Property(x => x.Name)
            .IsRequired()
            .HasMaxLength(EntityConfigurationConstants.NameMaxLength);

        builder.Property(x => x.StartDate);

        builder.Property(x => x.EndDate);

        builder.Property(x => x.Description)
            .HasMaxLength(EntityConfigurationConstants.DescriptionMaxLength);

        builder.HasIndex(x => x.Name);
    }
}
