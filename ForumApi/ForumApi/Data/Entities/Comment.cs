using ForumApi.Data.Dtos.Comments;

namespace ForumApi.Data.Entities
{
    public class Comment : BaseEntity<CommentDto>
    {
        public string Content { get; set; }
        public int PostId { get; set; }
        public Post Post { get; set; }

        public override CommentDto MapToDto()
        {
            return new CommentDto(Id, Content, PostId, CreatedDate);
        }
    }
}
