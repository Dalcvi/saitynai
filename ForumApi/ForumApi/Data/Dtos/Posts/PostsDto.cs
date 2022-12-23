using ForumApi.Auth.Model;

namespace ForumApi.Data.Dtos.Posts;

public record PostDto(int Id, string Title, string Content, int categoryId, DateTime CreationDate, UserDto User);
public record CreatePostDto(string Title, string Content);
public record UpdatePostDto(string Title, string Content);