namespace ForumApi.Data.Entities
{
    public abstract class BaseEntity<T>
    {
        public int Id { get; set; }
        public DateTime CreatedDate { get; set; } = DateTime.Now;

        public abstract T MapToDto();
    }
}
