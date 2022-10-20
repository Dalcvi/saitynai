using ForumApi.Data.Context;
using ForumApi.Data.Dtos.General;
using ForumApi.Data.Entities;
using ForumApi.Helpers;
using Microsoft.EntityFrameworkCore;

namespace ForumApi.Data.Repositories
{
    public interface IPostsRepository
    {
        Task CreateAsync(Post post);
        Task DeleteAsync(Post post);
        Task<PagedList<Post>> GetManyAsync(int categoryId, SearchParameters searchParams);
        Task<Post?> GetOneAsync(int categoryId, int postId);
        Task UpdateAsync(Post post);

    }

    public class PostsRepository : IPostsRepository
    {
        private readonly ForumDbContext forumDbContext;

        public PostsRepository(ForumDbContext forumContext)
        {
            this.forumDbContext = forumContext;
        }

        public async Task<Post?> GetOneAsync(int categoryId, int postId)
        {
            return await forumDbContext.Posts.FirstOrDefaultAsync(post => post.Id.Equals(postId) && post.Category.Id.Equals(categoryId));
        }

        public async Task<PagedList<Post>> GetManyAsync(int categoryId, SearchParameters searchParams)
        {
            var queryable = forumDbContext.Posts.AsQueryable().Where(post => post.Category.Id.Equals(categoryId)).OrderBy(category => category.CreatedDate);

            return await PagedList<Post>.CreateAsync(queryable, searchParams.PageNumber, searchParams.PageSize);
        }


        public async Task CreateAsync(Post post)
        {
            forumDbContext.Posts.Add(post);
            await forumDbContext.SaveChangesAsync();
        }

        public async Task UpdateAsync(Post post)
        {
            forumDbContext.Posts.Update(post);
            await forumDbContext.SaveChangesAsync();
        }

        public async Task DeleteAsync(Post post)
        {
            forumDbContext.Posts.Remove(post);
            await forumDbContext.SaveChangesAsync();
        }
    }
}
