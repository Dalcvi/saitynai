using ForumApi.Data.Context;
using ForumApi.Data.Dtos.General;
using ForumApi.Data.Entities;
using ForumApi.Helpers;
using Microsoft.EntityFrameworkCore;

namespace ForumApi.Data.Repositories
{
    public interface ICommentsRepository
    {
        Task CreateAsync(Comment comment);
        Task DeleteAsync(Comment comment);
        Task<PagedList<Comment>> GetManyAsync(int categoryId, int postId, SearchParameters searchParams);
        Task<Comment?> GetOneAsync(int categoryId, int postId, int commentId);
        Task UpdateAsync(Comment comment);
        Task<PagedList<Comment>> GetManyAsync(int categoryId, SearchParameters searchParams);

    }

    public class CommentsRepository : ICommentsRepository
    {
        private readonly ForumDbContext forumDbContext;

        public CommentsRepository(ForumDbContext forumContext)
        {
            this.forumDbContext = forumContext;
        }

        public async Task<Comment?> GetOneAsync(int categoryId, int postId, int commentId)
        {
            return await forumDbContext.Comments.FirstOrDefaultAsync(comment => comment.Id == commentId && comment.Post.Id == postId && comment.Post.Category.Id == categoryId);
        }

        public async Task<PagedList<Comment>> GetManyAsync(int categoryId, int postId, SearchParameters searchParams)
        {
            var queryable = forumDbContext.Comments.AsQueryable().Where(comment => comment.Post.Id == postId && comment.Post.Category.Id == categoryId)
                .OrderBy(comment => comment.CreatedDate);

            return await PagedList<Comment>.CreateAsync(queryable, searchParams.PageNumber, searchParams.PageSize);
        }

        public async Task<PagedList<Comment>> GetManyAsync(int categoryId, SearchParameters searchParams)
        {
            var queryable = forumDbContext.Comments.AsQueryable().Where(comment => comment.Post.Category.Id == categoryId)
                .OrderBy(comment => comment.CreatedDate);

            return await PagedList<Comment>.CreateAsync(queryable, searchParams.PageNumber, searchParams.PageSize);
        }



        public async Task CreateAsync(Comment comment)
        {
            forumDbContext.Comments.Add(comment);
            await forumDbContext.SaveChangesAsync();
        }

        public async Task UpdateAsync(Comment comment)
        {
            forumDbContext.Comments.Update(comment);
            await forumDbContext.SaveChangesAsync();
        }

        public async Task DeleteAsync(Comment comment)
        {
            forumDbContext.Comments.Remove(comment);
            await forumDbContext.SaveChangesAsync();
        }
    }

}
