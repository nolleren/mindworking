using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Mind.Core.Entities;

namespace Mind.Infrastructure.Persistence.Configurations;

public sealed class CvConfiguration : IEntityTypeConfiguration<Cv>
{
    public void Configure(EntityTypeBuilder<Cv> builder)
    {
        builder.ToTable("Cvs");
        builder.ConfigureBaseEntity();

        builder.Property(x => x.Name)
            .IsRequired()
            .HasMaxLength(EntityConfigurationConstants.NameMaxLength);

        builder.HasIndex(x => x.Name);

        builder.HasMany(x => x.Companies)
            .WithMany(x => x.Cvs)
            .UsingEntity<Dictionary<string, object>>(
                "CvCompany",
                right => right
                    .HasOne<Company>()
                    .WithMany()
                    .HasForeignKey("CompanyId")
                    .OnDelete(DeleteBehavior.Restrict),
                left => left
                    .HasOne<Cv>()
                    .WithMany()
                    .HasForeignKey("CvId")
                    .OnDelete(DeleteBehavior.Cascade),
                join =>
                {
                    join.ToTable("CvCompanies");
                    join.HasKey("CvId", "CompanyId");
                    join.HasIndex("CompanyId");
                });

        builder.HasMany(x => x.Projects)
            .WithMany(x => x.Cvs)
            .UsingEntity<Dictionary<string, object>>(
                "CvProject",
                right => right
                    .HasOne<Project>()
                    .WithMany()
                    .HasForeignKey("ProjectId")
                    .OnDelete(DeleteBehavior.Restrict),
                left => left
                    .HasOne<Cv>()
                    .WithMany()
                    .HasForeignKey("CvId")
                    .OnDelete(DeleteBehavior.Cascade),
                join =>
                {
                    join.ToTable("CvProjects");
                    join.HasKey("CvId", "ProjectId");
                    join.HasIndex("ProjectId");
                });

        builder.HasMany(x => x.Educations)
            .WithMany(x => x.Cvs)
            .UsingEntity<Dictionary<string, object>>(
                "CvEducation",
                right => right
                    .HasOne<Education>()
                    .WithMany()
                    .HasForeignKey("EducationId")
                    .OnDelete(DeleteBehavior.Restrict),
                left => left
                    .HasOne<Cv>()
                    .WithMany()
                    .HasForeignKey("CvId")
                    .OnDelete(DeleteBehavior.Cascade),
                join =>
                {
                    join.ToTable("CvEducations");
                    join.HasKey("CvId", "EducationId");
                    join.HasIndex("EducationId");
                });

        builder.HasMany(x => x.Skills)
            .WithMany(x => x.Cvs)
            .UsingEntity<Dictionary<string, object>>(
                "CvSkill",
                right => right
                    .HasOne<Skill>()
                    .WithMany()
                    .HasForeignKey("SkillId")
                    .OnDelete(DeleteBehavior.Restrict),
                left => left
                    .HasOne<Cv>()
                    .WithMany()
                    .HasForeignKey("CvId")
                    .OnDelete(DeleteBehavior.Cascade),
                join =>
                {
                    join.ToTable("CvSkills");
                    join.HasKey("CvId", "SkillId");
                    join.HasIndex("SkillId");
                });
    }
}
