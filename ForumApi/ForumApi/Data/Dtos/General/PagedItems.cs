namespace ForumApi.Data.Dtos.General
{
    public record PagedItems<T>(T Items, Metadata Metadata);
}
