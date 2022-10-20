using ForumApi.Data.Dtos.Posts;

namespace ForumApi.Data.Entities
{
    public class Post : BaseEntity<PostDto>
    {
        public string Title { get; set; }
        public string Content { get; set; }
        public int CategoryId { get; set; }
        public Category Category { get; set; }

        public override PostDto MapToDto()
        {
            return new PostDto(Id, Title, Content, CategoryId, CreatedDate);
        }
    }
}
