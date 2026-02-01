using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Mind.Core.Entities;

namespace Mind.Infrastructure.Persistence.Configurations;

public sealed class SkillConfiguration : IEntityTypeConfiguration<Skill>
{
    public void Configure(EntityTypeBuilder<Skill> builder)
    {
        builder.ToTable("Skills");
        builder.ConfigureBaseEntity();

        builder.Property(x => x.Name)
            .IsRequired()
            .HasMaxLength(EntityConfigurationConstants.NameMaxLength);

        builder.Property(x => x.Description)
            .HasMaxLength(EntityConfigurationConstants.DescriptionMaxLength);

        builder.Property(x => x.LevelOfMastery)
            .IsRequired()
            .HasConversion<string>()
            .HasMaxLength(EntityConfigurationConstants.EnumMaxLength);

        builder.HasIndex(x => x.Name)
            .IsUnique()
            .HasDatabaseName("UX_Skills_Name")
            .HasFilter("\"IsDeleted\" = false");
    }
}
