using ForumApi.Data.Dtos.Categories;
using ForumApi.Data.Dtos.Comments;
using ForumApi.Data.Dtos.General;
using ForumApi.Data.Entities;
using ForumApi.Data.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace ForumApi.Controllers
{
    [ApiController]
    [Route("api/categories")]
    public class CategoriesController : ControllerBase
    {
        private readonly ICategoriesRepository categoriesRepository;
        private readonly ICommentsRepository commentsRepository;
        private const string getCategoryRoute = "GetCategory";

        public CategoriesController(ICategoriesRepository categoriesRepository, ICommentsRepository commentsRepository)
        {
            this.categoriesRepository = categoriesRepository;
            this.commentsRepository = commentsRepository;
        }

        // GET: /api/categories?pageNumber=1&pageSize=10
        [HttpGet]
        public async Task<PagedItems<IEnumerable<CategoryDto>>> GetManyPaging([FromQuery] SearchParameters searchParams)
        {
            var categories = await categoriesRepository.GetManyAsync(searchParams);


            return new PagedItems<IEnumerable<CategoryDto>>(categories.Select(category => category.MapToDto()), categories.GetMetadata());
        }

        // GET: /api/categories/{categoryId}
        [HttpGet]
        [Route("{categoryId}", Name = getCategoryRoute)]
        public async Task<ActionResult<CategoryDto>> GetOne(int categoryId)
        {
            var category = await categoriesRepository.GetOneAsync(categoryId);
            if (category == null)
                return NotFound();

            return category.MapToDto();
        }

        // POST: /api/categories
        [HttpPost]
        public async Task<ActionResult<CategoryDto>> Create(CreateCategoryDto createCategoryDto)
        {
            var category = new Category { Title = createCategoryDto.Title, Description = createCategoryDto.Description };

            await categoriesRepository.CreateAsync(category);

            return CreatedAtRoute(getCategoryRoute, new { categoryId = category.Id }, category.MapToDto());
        }

        // PUT: /api/categories/{categoryId}
        [HttpPut]
        [Route("{categoryId}")]
        public async Task<ActionResult<CategoryDto>> Update(int categoryId, UpdateCategoryDto updateCategoryDto)
        {
            var category = await categoriesRepository.GetOneAsync(categoryId);
            if (category == null)
                return NotFound();

            category.Description = updateCategoryDto.Description;

            await categoriesRepository.UpdateAsync(category);

            return Ok(category.MapToDto());

        }

        // DELETE: /api/categories/{categoryId}
        [HttpDelete]
        [Route("{categoryId}")]
        public async Task<ActionResult> Delete(int categoryId)
        {
            var category = await categoriesRepository.GetOneAsync(categoryId);
            if (category == null)
                return NotFound();

            await categoriesRepository.DeleteAsync(category);

            return NoContent();
        }

        // GET: /api/categories/{categoryId}/comments?pageNumber=1&pageSize=10

        [HttpGet]
        [Route("{categoryId}/comments")]
        public async Task<ActionResult<PagedItems<IEnumerable<CommentDto>>>> GetComments(int categoryId, [FromQuery] SearchParameters searchParams)
        {
            var category = await categoriesRepository.GetOneAsync(categoryId);
            if (category == null)
                return NotFound();
            var comments = await commentsRepository.GetManyAsync(categoryId, searchParams);

            return new PagedItems<IEnumerable<CommentDto>>(comments.Select(comment => comment.MapToDto()), comments.GetMetadata());
        }
    }
}
