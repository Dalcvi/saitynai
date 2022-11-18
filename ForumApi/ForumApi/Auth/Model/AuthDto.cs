using System.ComponentModel.DataAnnotations;

namespace ForumApi.Auth.Model
{
    public record RegisterUser([Required][EmailAddress] string Email, [Required] string Username, [Required] string Password);
    public record LoginUser([Required][EmailAddress] string Email, [Required] string Password);
    public record SuccessfulRegisterDto(string Id);
    public record SuccessfulLoginDto(string AccessToken, UserDto User);
    public record UserDto(string Username, string Email, string Id);
}
