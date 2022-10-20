namespace ForumApi.Data.Dtos.Posts;

public record PostDto(int Id, string Title, string Content, int CategoryId, DateTime CreationDate);
public record CreatePostDto(string Title, string Content);
public record UpdatePostDto(string Content);