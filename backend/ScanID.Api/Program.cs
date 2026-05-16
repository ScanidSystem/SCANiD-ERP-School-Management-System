using Microsoft.EntityFrameworkCore;
using ScanID.Api.Data;
using ScanID.Api.Models;
using ScanID.Api.Utilities;

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

// Configure SQL Server
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

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

        // Log to Database
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
        throw; // Re-throw to let standard handlers work
    }
});

// Enable Swagger UI always for easier local testing
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "ScanID API v1");
    c.RoutePrefix = "swagger"; // Keep it at /swagger
});

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    // development-only features can go here
}

app.UseHttpsRedirection();
app.UseStaticFiles(); // Enable serving of static files from wwwroot
app.UseCors("AllowReactApp");

app.MapGet("/", () => Results.Content("<h1>ScanID API is running!</h1><p>Visit <a href='/swagger'>Swagger UI</a> for endpoints.</p>", "text/html"));

app.UseAuthorization();
app.MapControllers();

app.Run();

