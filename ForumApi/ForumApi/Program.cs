using ForumApi.Auth;
using ForumApi.Auth.Model;
using ForumApi.Data;
using ForumApi.Data.Context;
using ForumApi.Data.Repositories;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Text;

WebApplicationBuilder appBuilder = WebApplication.CreateBuilder(args);
JwtSecurityTokenHandler.DefaultInboundClaimTypeMap.Clear();

appBuilder.Services.AddControllers();

appBuilder.Services.AddIdentity<ForumRestUser, IdentityRole>()
    .AddEntityFrameworkStores<ForumDbContext>()
    .AddDefaultTokenProviders();

appBuilder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
})
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters.ValidAudience = appBuilder.Configuration["JWT:ValidAudience"];
        options.TokenValidationParameters.ValidIssuer = appBuilder.Configuration["JWT:ValidIssuer"];
        options.TokenValidationParameters.IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(appBuilder.Configuration["JWT:Secret"]));
    });

appBuilder.Services.Configure<IdentityOptions>(options =>
{
    options.Password.RequireNonAlphanumeric = false;
});

appBuilder.Services.AddDbContext<ForumDbContext>();
appBuilder.Services.AddTransient<ICategoriesRepository, CategoriesRepository>();
appBuilder.Services.AddTransient<IPostsRepository, PostsRepository>();
appBuilder.Services.AddTransient<ICommentsRepository, CommentsRepository>();
appBuilder.Services.AddTransient<IJwtTokenService, JwtTokenService>();
appBuilder.Services.AddScoped<AuthDbSeeder>();

appBuilder.Services.AddAuthorization(options =>
{
    options.AddPolicy(Policies.ContentOwner, policy => policy.Requirements.Add(new ResourceOwnerRequirement()));
});
appBuilder.Services.AddSingleton<IAuthorizationHandler, ResourceOwnerAuthorizationHandler>();

appBuilder.Services.AddSwaggerGen(swagger =>
{
    swagger.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Forum API",
        Description = "API for forum application"
    });

    swagger.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme()
    {
        Name = "Authorization",
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "JWT Authorization header using the Bearer scheme. \r\n\r\n Enter 'Bearer' [space] and then your token in the text input below.\r\n\r\nExample: \"Bearer 1safsfsdfdfd\"",
    });
    swagger.AddSecurityRequirement(new OpenApiSecurityRequirement {
        {
            new OpenApiSecurityScheme {
                Reference = new OpenApiReference {
                    Type = ReferenceType.SecurityScheme,
                        Id = "Bearer"
                }
            },
            new string[] {}
        }
    });
});


WebApplication app = appBuilder.Build();

app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "Forum API");
    c.RoutePrefix = string.Empty;
});


app.UseRouting();
app.MapControllers();
app.UseAuthentication();
app.UseAuthorization();

var dbSeeder = app.Services.CreateScope().ServiceProvider.GetRequiredService<AuthDbSeeder>();
await dbSeeder.SeedAsync();

app.Run();
