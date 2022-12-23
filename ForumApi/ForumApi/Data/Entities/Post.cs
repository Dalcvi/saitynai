using ForumApi.Auth.Model;
using ForumApi.Data.Dtos.Posts;
using System.ComponentModel.DataAnnotations.Schema;

namespace ForumApi.Data.Entities
{
    public class Post : BaseEntity<PostDto>, IUserOwnedResource
    {
        public string Title { get; set; }
        public string Content { get; set; }
        public int CategoryId { get; set; }
        public Category Category { get; set; }
        public string? UserId { get; set; }
        [ForeignKey("UserId")]
        public ForumRestUser User { get; set; }

        public override PostDto MapToDto()
        {
            return new PostDto(Id, Title, Content, CategoryId, CreatedDate, User.MapToDto());
        }
    }
}
