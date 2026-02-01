using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Mind.Core.Entities;

namespace Mind.Infrastructure.Persistence.Configurations;

public sealed class CompanyConfiguration : IEntityTypeConfiguration<Company>
{
    public void Configure(EntityTypeBuilder<Company> builder)
    {
        builder.ToTable("Companies");
        builder.ConfigureBaseEntity();

        builder.Property(x => x.Name)
            .IsRequired()
            .HasMaxLength(EntityConfigurationConstants.NameMaxLength);

        builder.Property(x => x.Address)
            .HasMaxLength(EntityConfigurationConstants.AddressMaxLength);

        builder.Property(x => x.ZipCode)
            .HasMaxLength(EntityConfigurationConstants.ZipCodeMaxLength);

        builder.Property(x => x.City)
            .HasMaxLength(EntityConfigurationConstants.CityMaxLength);

        builder.Property(x => x.Description)
            .HasMaxLength(EntityConfigurationConstants.DescriptionMaxLength);

        builder.HasIndex(x => x.Name)
            .IsUnique()
            .HasDatabaseName("UX_Companies_Name")
            .HasFilter("\"IsDeleted\" = false");
    }
}
