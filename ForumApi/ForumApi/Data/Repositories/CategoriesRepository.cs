using ForumApi.Data.Context;
using ForumApi.Data.Dtos.General;
using ForumApi.Data.Entities;
using ForumApi.Helpers;
using Microsoft.EntityFrameworkCore;

namespace ForumApi.Data.Repositories
{
    public interface ICategoriesRepository
    {
        Task CreateAsync(Category category);
        Task DeleteAsync(Category category);
        Task<PagedList<Category>> GetManyAsync(SearchParameters searchParams);
        Task<Category?> GetOneAsync(int categoryId);
        Task UpdateAsync(Category category);
    }

    public class CategoriesRepository : ICategoriesRepository
    {
        private readonly ForumDbContext forumDbContext;

        public CategoriesRepository(ForumDbContext forumContext)
        {
            this.forumDbContext = forumContext;
        }

        public async Task<Category?> GetOneAsync(int categoryId)
        {
            return await forumDbContext.Categories.FirstOrDefaultAsync(category => category.Id.Equals(categoryId));
        }

        public async Task<PagedList<Category>> GetManyAsync(SearchParameters searchParams)
        {
            var queryable = forumDbContext.Categories.AsQueryable().OrderBy(category => category.CreatedDate);

            return await PagedList<Category>.CreateAsync(queryable, searchParams.PageNumber, searchParams.PageSize);
        }

        public async Task CreateAsync(Category category)
        {
            forumDbContext.Categories.Add(category);
            await forumDbContext.SaveChangesAsync();
        }

        public async Task UpdateAsync(Category category)
        {
            forumDbContext.Categories.Update(category);
            await forumDbContext.SaveChangesAsync();
        }

        public async Task DeleteAsync(Category category)
        {
            forumDbContext.Categories.Remove(category);
            await forumDbContext.SaveChangesAsync();
        }
    }
}
