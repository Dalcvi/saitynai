using ForumApi.Data.Context;
using ForumApi.Data.Repositories;

WebApplicationBuilder appBuilder = WebApplication.CreateBuilder(args);

appBuilder.Services.AddControllers();

appBuilder.Services.AddDbContext<ForumDbContext>();
appBuilder.Services.AddTransient<ICategoriesRepository, CategoriesRepository>();
appBuilder.Services.AddTransient<IPostsRepository, PostsRepository>();
appBuilder.Services.AddTransient<ICommentsRepository, CommentsRepository>();

appBuilder.Services.AddSwaggerGen(swagger =>
{
    swagger.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo
    {
        Title = "Forum API",
        Description = "API for forum application"
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

app.Run();
