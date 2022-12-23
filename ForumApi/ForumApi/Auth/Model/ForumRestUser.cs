using Microsoft.AspNetCore.Identity;

namespace ForumApi.Auth.Model
{
    public class ForumRestUser : IdentityUser
    {
        public UserDto MapToDto()
        {
            return new UserDto(UserName, Email, Id);
        }
    }
}
