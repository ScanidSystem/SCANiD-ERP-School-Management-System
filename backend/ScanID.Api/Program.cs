using Microsoft.EntityFrameworkCore;
using ScanID.Api.Data;
using ScanID.Api.Interfaces;
using ScanID.Api.Models;
using ScanID.Api.Services;
using ScanID.Api.Utilities;
using Microsoft.AspNetCore.HttpOverrides;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.Configure<RouteOptions>(options =>
{
    options.LowercaseUrls = true;
    options.LowercaseQueryStrings = true;
});
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo
    {
        Title = "ScanID School Management API",
        Version = "v1",
        Description = "API for student monitoring, attendance, and fee management."
    });
});

builder.Services.Configure<ForwardedHeadersOptions>(options =>
{
    options.ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto;
    options.KnownNetworks.Clear();
    options.KnownProxies.Clear();
});

// Configure SQL Server
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Register Decoupled Abstractions & Implementation services (SOLID, SRP, OCP, DIP)
builder.Services.AddScoped(typeof(IRepository<>), typeof(Repository<>));
builder.Services.AddScoped<IStudentService, StudentService>();
builder.Services.AddScoped<IErrorLogService, ErrorLogService>();
builder.Services.AddScoped<ISchoolService, SchoolService>();
builder.Services.AddScoped<ITeacherService, TeacherService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IAttendanceService, AttendanceService>();
builder.Services.AddScoped<IAuditLogService, AuditLogService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IFeeService, FeeService>();
builder.Services.AddScoped<IMarkService, MarkService>();

// Configure CORS for React Frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy =>
        {
            policy.WithOrigins("http://localhost:3000", "http://localhost:5000", "http://localhost:5173", "http://localhost:4173")
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

var app = builder.Build();

app.UseForwardedHeaders();
// Automatically check/create/remediate missing master tables in live DB to prevent 500 errors
try
{
    using (var scope = app.Services.CreateScope())
    {
        var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

        // 1. Check if States table exists, if not create it (due to FK dependency in Cities)
        context.Database.ExecuteSqlRaw(@"
            IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[States]') AND type in (N'U'))
            BEGIN
            CREATE TABLE [dbo].[States](
                [Id] [int] IDENTITY(1,1) NOT NULL,
                [Name] [nvarchar](100) NOT NULL,
                [IsActive] [bit] NOT NULL CONSTRAINT [DF_States_IsActive] DEFAULT (1),
                [IsDeleted] [bit] NOT NULL CONSTRAINT [DF_States_IsDeleted] DEFAULT (0),
                [CreatedBy] [nvarchar](max) NULL,
                [CreatedOn] [datetime2](7) NOT NULL CONSTRAINT [DF_States_CreatedOn] DEFAULT (GETUTCDATE()),
                [ModifiedBy] [nvarchar](max) NULL,
                [ModifiedOn] [datetime2](7) NOT NULL CONSTRAINT [DF_States_ModifiedOn] DEFAULT (GETUTCDATE()),
             CONSTRAINT [PK_States] PRIMARY KEY CLUSTERED ([Id] ASC)
            )
            END
        ");

        // 2. Check if Cities table exists, if not create it
        context.Database.ExecuteSqlRaw(@"
            IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Cities]') AND type in (N'U'))
            BEGIN
            CREATE TABLE [dbo].[Cities](
                [Id] [int] IDENTITY(1,1) NOT NULL,
                [StateId] [int] NOT NULL,
                [Name] [nvarchar](100) NOT NULL,
                [IsActive] [bit] NOT NULL CONSTRAINT [DF_Cities_IsActive] DEFAULT (1),
                [IsDeleted] [bit] NOT NULL CONSTRAINT [DF_Cities_IsDeleted] DEFAULT (0),
                [CreatedBy] [nvarchar](max) NULL,
                [CreatedOn] [datetime2](7) NOT NULL CONSTRAINT [DF_Cities_CreatedOn] DEFAULT (GETUTCDATE()),
                [ModifiedBy] [nvarchar](max) NULL,
                [ModifiedOn] [datetime2](7) NOT NULL CONSTRAINT [DF_Cities_ModifiedOn] DEFAULT (GETUTCDATE()),
             CONSTRAINT [PK_Cities] PRIMARY KEY CLUSTERED ([Id] ASC),
             CONSTRAINT [FK_Cities_States] FOREIGN KEY([StateId]) REFERENCES [dbo].[States] ([Id])
            )
            END
        ");

        // 3. Check if SchoolSections table exists, if not create it
        context.Database.ExecuteSqlRaw(@"
            IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[SchoolSections]') AND type in (N'U'))
            BEGIN
            CREATE TABLE [dbo].[SchoolSections](
                [Id] [int] IDENTITY(1,1) NOT NULL,
                [Name] [nvarchar](100) NOT NULL,
                [IsActive] [bit] NOT NULL CONSTRAINT [DF_SchoolSections_IsActive] DEFAULT (1),
                [IsDeleted] [bit] NOT NULL CONSTRAINT [DF_SchoolSections_IsDeleted] DEFAULT (0),
                [CreatedBy] [nvarchar](max) NULL,
                [CreatedOn] [datetime2](7) NOT NULL CONSTRAINT [DF_SchoolSections_CreatedOn] DEFAULT (GETUTCDATE()),
                [ModifiedBy] [nvarchar](max) NULL,
                [ModifiedOn] [datetime2](7) NOT NULL CONSTRAINT [DF_SchoolSections_ModifiedOn] DEFAULT (GETUTCDATE()),
             CONSTRAINT [PK_SchoolSections] PRIMARY KEY CLUSTERED ([Id] ASC)
            )
            END
        ");

        // 4. Seed initial data to the newly created / existing empty master tables
        if (!context.SchoolSections.Any())
        {
            context.SchoolSections.Add(new SchoolSection { Name = "Primary", IsActive = true, IsDeleted = false, CreatedBy = "SYSTEM" });
            context.SchoolSections.Add(new SchoolSection { Name = "Secondary", IsActive = true, IsDeleted = false, CreatedBy = "SYSTEM" });
            context.SchoolSections.Add(new SchoolSection { Name = "Higher Secondary", IsActive = true, IsDeleted = false, CreatedBy = "SYSTEM" });
            context.SaveChanges();
        }

        if (!context.States.Any())
        {
            var maharashtra = new State { Name = "MAHARASHTRA", IsActive = true, IsDeleted = false, CreatedBy = "SYSTEM" };
            var delhi = new State { Name = "DELHI", IsActive = true, IsDeleted = false, CreatedBy = "SYSTEM" };
            var karnataka = new State { Name = "KARNATAKA", IsActive = true, IsDeleted = false, CreatedBy = "SYSTEM" };
            context.States.AddRange(maharashtra, delhi, karnataka);
            context.SaveChanges();

            if (!context.Cities.Any())
            {
                context.Cities.Add(new City { StateId = maharashtra.Id, Name = "Mumbai", IsActive = true, IsDeleted = false, CreatedBy = "SYSTEM" });
                context.Cities.Add(new City { StateId = maharashtra.Id, Name = "Pune", IsActive = true, IsDeleted = false, CreatedBy = "SYSTEM" });
                context.Cities.Add(new City { StateId = delhi.Id, Name = "New Delhi", IsActive = true, IsDeleted = false, CreatedBy = "SYSTEM" });
                context.SaveChanges();
            }
        }
    }
}
catch (Exception ex)
{
    Console.WriteLine("Database self-healing/creation error: " + ex.Message);
    FileLogger.LogError(ex);
}

// Global Exception Handler Middleware
app.Use(async (context, next) =>
{
    try
    {
        await next();
    }
    catch (Exception ex)
    {
        // Log to Filesystem
        FileLogger.LogError(ex);

        // Log to Database (optional, don't crash if DB is down)
        try
        {
            var db = context.RequestServices.GetRequiredService<ApplicationDbContext>();
            db.ErrorLogs.Add(new ErrorLog
            {
                Message = ex.Message,
                Exception = ex.ToString(),
                Level = "Error",
                Timestamp = DateTime.Now,
                Properties = $"Path: {context.Request.Path}"
            });
            await db.SaveChangesAsync();
        }
        catch (Exception dbEx)
        {
            FileLogger.LogError(new Exception("Failed to log error to database. " + dbEx.Message, dbEx));
        }

        // Return a cleaner 500 error instead of throwing a raw exception that might leak info
        context.Response.StatusCode = 500;
        context.Response.ContentType = "application/json";
        await context.Response.WriteAsJsonAsync(new
        {
            error = "Internal Server Error",
            message = ex.Message,
            details = "Check server logs for more information."
        });
    }
});

// Enable Swagger UI always for easier local testing
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    //c.SwaggerEndpoint("/swagger/v1/swagger.json", "ScanID API v1");
    c.SwaggerEndpoint("./v1/swagger.json", "ScanID API v1");
    c.RoutePrefix = "swagger"; // Keep it at /swagger
});

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    // In development, we might not have SSL certificates configured locally, 
    // so we skip redirection to prevent "Empty Response" errors.
}
else
{
    //app.UseHttpsRedirection();
}
app.UseStaticFiles(); // Enable serving of static files from wwwroot
app.UseCors("AllowReactApp");

app.MapGet("/", () => Results.Content("<h1>ScanID API is running!</h1><p>Visit <a href='/swagger'>Swagger UI</a> for endpoints.</p>", "text/html"));

app.UseAuthorization();
app.MapControllers();

app.Run();

