var builder = DistributedApplication.CreateBuilder(args);

var postgresPassword = builder.AddParameter("postgres-password", "postgres", secret: true);

var postgres = builder
	.AddPostgres("postgres")
	.WithPassword(postgresPassword)
	.WithDataVolume("mind-postgres-data");

var mindDb = postgres.AddDatabase("minddb");

builder
	.AddContainer("adminer", "adminer", "latest")
	.WithHttpEndpoint(targetPort: 8080, name: "http")
	.WithEnvironment("ADMINER_DEFAULT_SERVER", "postgres")
	.WaitFor(postgres);

builder
	.AddProject<Projects.Mind_Api>("mind-api")
	.WithReference(mindDb)
	.WaitFor(mindDb);

builder.Build().Run();
