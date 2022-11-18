using ForumApi.Auth.Model;
using ForumApi.Data.Dtos.Comments;
using System.ComponentModel.DataAnnotations.Schema;

namespace ForumApi.Data.Entities
{
    public class Comment : BaseEntity<CommentDto>, IUserOwnedResource
    {
        public string Content { get; set; }
        public int PostId { get; set; }
        public Post Post { get; set; }
        public string? UserId { get; set; }
        [ForeignKey("UserId")]
        public ForumRestUser? User { get; set; }
        public override CommentDto MapToDto()
        {
            return new CommentDto(Id, Content, PostId, CreatedDate, UserId);
        }
    }
}
