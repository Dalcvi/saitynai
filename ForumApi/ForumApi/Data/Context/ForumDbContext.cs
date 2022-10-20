using ForumApi.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace ForumApi.Data.Context
{
    public class ForumDbContext : DbContext
    {
        public DbSet<Category> Categories { get; set; }
        public DbSet<Post> Posts { get; set; }
        public DbSet<Comment> Comments { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlServer("Data Source=(localdb)\\MSSQLLocalDB; Initial Catalog=ForumDb;TrustServerCertificate=True;");
        }
    }
}
