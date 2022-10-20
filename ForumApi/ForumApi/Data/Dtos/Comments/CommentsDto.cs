namespace ForumApi.Data.Dtos.Comments;

public record CommentDto(int Id, string Content, int PostId, DateTime CreationDate);
public record CreateCommentDto(string Content);
public record UpdateCommentDto(string Content);