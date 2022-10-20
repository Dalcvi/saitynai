using ForumApi.Data.Dtos.Comments;
using ForumApi.Data.Dtos.General;
using ForumApi.Data.Entities;
using ForumApi.Data.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace ForumApi.Controllers
{
    [ApiController]
    [Route("api/categories/{categoryId}/posts/{postId}/comments")]
    public class CommentsController : ControllerBase
    {
        private readonly IPostsRepository postsRepository;
        private readonly ICommentsRepository commentsRepository;

        private const string getCommentRoute = "GetComment";

        public CommentsController(ICommentsRepository commentsRepository, IPostsRepository postsRepository)
        {
            this.commentsRepository = commentsRepository;
            this.postsRepository = postsRepository;
        }

        // GET: /api/categories/{categoryId}/posts/{postId}/comments?pageNumber=1&pageSize=10
        [HttpGet]
        public async Task<PagedItems<IEnumerable<CommentDto>>> GetManyPaging(int categoryId, int postId, [FromQuery] SearchParameters searchParams)
        {
            var comments = await commentsRepository.GetManyAsync(categoryId, postId, searchParams);


            return new PagedItems<IEnumerable<CommentDto>>(comments.Select(comment => comment.MapToDto()), comments.GetMetadata());
        }

        // GET: /api/categories/{categoryId}/posts/{postId}/comments/{commentId}
        [HttpGet]
        [Route("{commentId}", Name = getCommentRoute)]
        public async Task<ActionResult<CommentDto>> GetOne(int categoryId, int postId, int commentId)
        {
            var comment = await commentsRepository.GetOneAsync(categoryId, postId, commentId);
            if (comment == null)
                return NotFound();

            return comment.MapToDto();
        }

        // POST: /api/categories/{categoryId}/posts/{postId}/comments
        [HttpPost]
        public async Task<ActionResult<CommentDto>> Create(int categoryId, int postId, CreateCommentDto createCommentDto)
        {
            var post = await postsRepository.GetOneAsync(categoryId, postId);
            if (post == null)
                return NotFound();


            var comment = new Comment { Post = post, Content = createCommentDto.Content };
            Console.WriteLine("---");
            Console.WriteLine(post.CategoryId);
            Console.WriteLine("---");

            await commentsRepository.CreateAsync(comment);
            return CreatedAtRoute(getCommentRoute, new { categoryId = post.CategoryId, postId = post.Id, commentId = comment.Id }, comment.MapToDto());
        }

        // PUT: /api/categories/{categoryId}/posts/{postId}/comments/{commentId}
        [HttpPut]
        [Route("{commentId}")]
        public async Task<ActionResult<CommentDto>> Update(int categoryId, int postId, int commentId, UpdateCommentDto updateCommentDto)
        {
            var comment = await commentsRepository.GetOneAsync(categoryId, postId, commentId);
            if (comment == null)
                return NotFound();

            comment.Content = updateCommentDto.Content;

            await commentsRepository.UpdateAsync(comment);

            return Ok(comment.MapToDto());

        }

        // DELETE: /api/categories/{categoryId}/posts/{postId}/comments/{commentId}
        [HttpDelete]
        [Route("{commentId}")]
        public async Task<ActionResult> Delete(int categoryId, int postId, int commentId)
        {
            var comment = await commentsRepository.GetOneAsync(categoryId, postId, commentId);
            if (comment == null)
                return NotFound();

            await commentsRepository.DeleteAsync(comment);

            return NoContent();
        }
    }
}
