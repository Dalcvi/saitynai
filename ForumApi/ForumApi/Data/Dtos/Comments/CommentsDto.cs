using ForumApi.Auth.Model;

namespace ForumApi.Data.Dtos.Comments;

public record CommentDto(int Id, string Content, int postId, DateTime CreationDate, UserDto user);
public record CreateCommentDto(string Content);
public record UpdateCommentDto(string Content);