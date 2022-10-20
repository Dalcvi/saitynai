using ForumApi.Data.Dtos.General;
using ForumApi.Data.Dtos.Posts;
using ForumApi.Data.Entities;
using ForumApi.Data.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace ForumApi.Controllers
{
    [ApiController]
    [Route("api/categories/{categoryId}/posts")]
    public class PostsController : ControllerBase
    {
        private readonly IPostsRepository postsRepository;
        private readonly ICategoriesRepository categoriesRepository;
        private const string getPostRoute = "GetPost";


        public PostsController(IPostsRepository postsRepository, ICategoriesRepository categoriesRepository)
        {
            this.postsRepository = postsRepository;
            this.categoriesRepository = categoriesRepository;
        }

        // GET: /api/categories/{categoryId}/posts?pageNumber=1&pageSize=10
        [HttpGet]
        public async Task<PagedItems<IEnumerable<PostDto>>> GetManyPaging(int categoryId, [FromQuery] SearchParameters searchParams)
        {
            var posts = await postsRepository.GetManyAsync(categoryId, searchParams);


            return new PagedItems<IEnumerable<PostDto>>(posts.Select(post => post.MapToDto()), posts.GetMetadata());
        }

        // GET: /api/categories/{categoryId}/posts/{postId}
        [HttpGet]
        [Route("{postId}", Name = getPostRoute)]
        public async Task<ActionResult<PostDto>> GetOne(int categoryId, int postId)
        {
            var post = await postsRepository.GetOneAsync(categoryId, postId);
            if (post == null)
                return NotFound();

            return post.MapToDto();
        }

        // POST: /api/categories/{categoryId}/posts
        [HttpPost]
        public async Task<ActionResult<PostDto>> Create(int categoryId, CreatePostDto createPostDto)
        {
            var category = await categoriesRepository.GetOneAsync(categoryId);
            if (category == null)
                return NotFound();

            var post = new Post { Category = category, Title = createPostDto.Title, Content = createPostDto.Content };

            await postsRepository.CreateAsync(post);

            return CreatedAtRoute(getPostRoute, new { categoryId = category.Id, postId = post.Id }, post.MapToDto());
        }

        // PUT: /api/categories/{categoryId}/posts/{postId}
        [HttpPut]
        [Route("{postId}")]
        public async Task<ActionResult<PostDto>> Update(int categoryId, int postId, UpdatePostDto updatePostDto)
        {
            var post = await postsRepository.GetOneAsync(categoryId, postId);
            if (post == null)
                return NotFound();

            post.Content = updatePostDto.Content;

            await postsRepository.UpdateAsync(post);

            return Ok(post.MapToDto());

        }

        // DELETE: /api/categories/{categoryId}/posts/{postId}
        [HttpDelete]
        [Route("{postId}")]
        public async Task<ActionResult> Delete(int categoryId, int postId)
        {
            var post = await postsRepository.GetOneAsync(categoryId, postId);
            if (post == null)
                return NotFound();

            await postsRepository.DeleteAsync(post);

            return NoContent();
        }
    }
}
