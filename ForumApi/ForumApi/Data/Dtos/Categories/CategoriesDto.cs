namespace ForumApi.Data.Dtos.Categories;

public record CategoryDto(int Id, string Title, string Description, DateTime CreationDate);
public record CreateCategoryDto(string Title, string Description);
public record UpdateCategoryDto(string Title, string Description);