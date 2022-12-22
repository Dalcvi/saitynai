using ForumApi.Auth;
using ForumApi.Auth.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace ForumApi.Controllers
{
    [Route("api/auth")]
    [AllowAnonymous]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<ForumRestUser> _userManager;
        private readonly IJwtTokenService _jwtTokenService;

        public AuthController(UserManager<ForumRestUser> userManager, IJwtTokenService jwtTokenService)
        {
            _userManager = userManager;
            _jwtTokenService = jwtTokenService;
        }

        [HttpPost]
        [Route("register")]
        public async Task<IActionResult> Register(RegisterUser registerUserDto)
        {
            var user = await _userManager.FindByEmailAsync(registerUserDto.Email);
            if (user != null)
            {
                return BadRequest("User already exists.");
            }
            var newUser = new ForumRestUser
            {
                Email = registerUserDto.Email,
                UserName = registerUserDto.Username
            };

            var createdUserResult = await _userManager.CreateAsync(newUser, registerUserDto.Password);

            if (!createdUserResult.Succeeded)
            {
                return BadRequest("Could not create a user");
            }

            await _userManager.AddToRoleAsync(newUser, Roles.User);

            return CreatedAtAction(nameof(Register), new SuccessfulRegisterDto(newUser.Id));
        }

        [HttpPost]
        [Route("login")]
        public async Task<IActionResult> Login(LoginUser loginUserDto)
        {
            var user = await _userManager.FindByEmailAsync(loginUserDto.Email);
            if (user == null)
            {
                return BadRequest("Wrong email or password.");
            }

            bool isPasswordValid = await _userManager.CheckPasswordAsync(user, loginUserDto.Password);

            if (!isPasswordValid)
            {
                return BadRequest("Wrong email or password.");
            }

            var roles = await _userManager.GetRolesAsync(user);
            var accessToken = _jwtTokenService.CreateAccessToken(user.Email, user.Id, roles);

            return Ok(new SuccessfulLoginDto(accessToken, new UserDto(user.UserName, user.Email, user.Id), roles));
        }

        [Authorize(Roles = Roles.User)]
        [HttpGet]
        [Route("token-login")]
        public async Task<IActionResult> TokenLogin()
        {
            ClaimsPrincipal currentUser = this.User;
            var userEmail = currentUser.FindFirst(ClaimTypes.Email).Value;
            var user = await _userManager.FindByEmailAsync(userEmail);
            if (user == null)
            {
                return BadRequest("Bad token");
            }

            var roles = await _userManager.GetRolesAsync(user);
            var accessToken = _jwtTokenService.CreateAccessToken(user.Email, user.Id, roles);
            return Ok(new SuccessfulLoginDto(accessToken, new UserDto(user.UserName, user.Email, user.Id), roles));
        }
    }
}
