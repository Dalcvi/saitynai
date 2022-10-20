using ForumApi.Data.Dtos.Categories;

namespace ForumApi.Data.Entities
{
    public class Category : BaseEntity<CategoryDto>
    {
        public string Title { get; set; }
        public string Description { get; set; }

        public override CategoryDto MapToDto()
        {
            return new CategoryDto(Id, Title, Description, CreatedDate);
        }
    }
}
