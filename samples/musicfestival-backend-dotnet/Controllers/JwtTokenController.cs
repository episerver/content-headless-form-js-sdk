using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

namespace MusicFestival.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class JwtTokenController : ControllerBase
    {
        private readonly string SecretKey = "6e13c68325f0379c2a6b1277e4eb9b97";

        public JwtTokenController() { }

        [HttpGet("GetJwtToken")]
        public JsonResult GetJwtToken(string username)
        {
            return new JsonResult(GenerateToken(new() { Username = username, Role = "user"}));
        }
        // To generate token
        private string GenerateToken(UserModel user)
        {
            var encryptionKey = Encoding.UTF8.GetBytes(SecretKey);

            var claims = new[]
            {
                new Claim("name", user.Username),
                new Claim("role", user.Role)
            };

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Issuer = "tsng",
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddDays(1),
            };

            var tokenHandler = new JwtSecurityTokenHandler();

            var token = tokenHandler.CreateJwtSecurityToken(tokenDescriptor);

            return tokenHandler.WriteToken(token);
        }

        private class UserModel
        {
            public string Username { get; set; }
            public string Role { get; set; }
        }

    }
}
