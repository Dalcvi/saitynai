namespace ForumApi.Auth.Model
{
    public static class Roles
    {
        public const string User = "user";
        public const string Admin = "admin";

        public static readonly IReadOnlyCollection<string> List = new List<string>() { User, Admin };
    }
}
