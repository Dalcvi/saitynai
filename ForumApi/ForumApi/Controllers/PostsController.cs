using ForumApi.Auth.Model;
using ForumApi.Data.Dtos.General;
using ForumApi.Data.Dtos.Posts;
using ForumApi.Data.Entities;
using ForumApi.Data.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.JsonWebTokens;
using System.Security.Claims;

namespace ForumApi.Controllers
{
    [ApiController]
    [Route("api/categories/{categoryId}/posts")]
    public class PostsController : ControllerBase
    {
        private readonly IPostsRepository postsRepository;
        private readonly ICategoriesRepository categoriesRepository;
        private readonly IAuthorizationService authorizationService;
        private readonly UserManager<ForumRestUser> _userManager;
        private const string getPostRoute = "GetPost";

        public PostsController(IPostsRepository postsRepository, ICategoriesRepository categoriesRepository, IAuthorizationService authorizationService, UserManager<ForumRestUser> userManager)
        {
            this.postsRepository = postsRepository;
            this.categoriesRepository = categoriesRepository;
            this.authorizationService = authorizationService;
            this._userManager = userManager;
        }

        // GET: /api/categories/{categoryId}/posts?pageNumber=1&pageSize=10
        [AllowAnonymous]
        [HttpGet]
        public async Task<PagedItems<IEnumerable<PostDto>>> GetManyPaging(int categoryId, [FromQuery] SearchParameters searchParams)
        {
            var posts = await postsRepository.GetManyAsync(categoryId, searchParams);


            return new PagedItems<IEnumerable<PostDto>>(posts.Select(post => post.MapToDto()), posts.GetMetadata());
        }

        // GET: /api/categories/{categoryId}/posts/{postId}
        [HttpGet]
        [AllowAnonymous]
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
        [Authorize(Roles = Roles.User)]
        public async Task<ActionResult<PostDto>> Create(int categoryId, CreatePostDto createPostDto)
        {
            var category = await categoriesRepository.GetOneAsync(categoryId);
            if (category == null)
                return NotFound();

            var user = await _userManager.FindByIdAsync(User.FindFirstValue(JwtRegisteredClaimNames.Sub));

            var post = new Post { Category = category, Title = createPostDto.Title, Content = createPostDto.Content, User = user };

            await postsRepository.CreateAsync(post);
            return CreatedAtRoute(getPostRoute, new { categoryId = category.Id, postId = post.Id }, post.MapToDto());
        }

        // PUT: /api/categories/{categoryId}/posts/{postId}
        [HttpPut]
        [Authorize(Roles = Roles.User)]
        [Route("{postId}")]
        public async Task<ActionResult<PostDto>> Update(int categoryId, int postId, UpdatePostDto updatePostDto)
        {
            var post = await postsRepository.GetOneAsync(categoryId, postId);
            if (post == null)
                return NotFound();


            var authResult = await authorizationService.AuthorizeAsync(User, post, Policies.ContentOwner);
            if (!authResult.Succeeded)
            {
                return Forbid();
            }

            post.Content = updatePostDto.Content;
            post.Title = updatePostDto.Title;

            await postsRepository.UpdateAsync(post);

            return Ok(post.MapToDto());

        }

        // DELETE: /api/categories/{categoryId}/posts/{postId}
        [HttpDelete]
        [Authorize(Roles = Roles.User)]
        [Route("{postId}")]
        public async Task<ActionResult> Delete(int categoryId, int postId)
        {
            var post = await postsRepository.GetOneAsync(categoryId, postId);
            if (post == null)
                return NotFound();

            var authResult = await authorizationService.AuthorizeAsync(User, post, Policies.ContentOwner);
            if (!authResult.Succeeded)
            {
                return Forbid();
            }
            await postsRepository.DeleteAsync(post);

            return NoContent();
        }
    }
}
