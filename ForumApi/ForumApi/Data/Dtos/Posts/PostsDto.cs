namespace ForumApi.Data.Dtos.Posts;

public record PostDto(int Id, string Title, string Content, int CategoryId, DateTime CreationDate, string? UserId);
public record CreatePostDto(string Title, string Content);
public record UpdatePostDto(string Title, string Content);