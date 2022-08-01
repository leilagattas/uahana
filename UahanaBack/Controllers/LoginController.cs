using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using uahana.Models;
using uahana.Services;

namespace uahana.Controllers
{
    [Route("api/v1/[controller]")]
    [ApiController]
    public class LoginController : Controller
    {
        private IConfiguration _config;
        private IUserService _userService;
        public LoginController(IConfiguration config,
                                IUserService userService)
        {
            _config = config;
            _userService = userService;
        }

        [HttpPost]
        [AllowAnonymous]
        public IActionResult Login([FromBody] UserDto login)
        {
            IActionResult response = Unauthorized();
            //var user = AuthenticateUser(login);
            var user = _userService.Authenticate(login.email, login.password);

            if (user != null)
            {
                var tokenString = GenerateJSONWebToken(user);
                response = Ok(new { token = tokenString });
            }
            return response;
        }

        [AllowAnonymous]
        [HttpPost("register")]
        public IActionResult Register([FromBody] UserDto userDto)
        {
            User user = new User { };
            user.email = userDto.email;
            user.nombre = userDto.nombre;
            user.apellido = userDto.apellido;
            user.dni = (long)userDto.dni;
            user.fechaNacimiento = (DateTime)userDto.fechaNacimiento;
            user.fechaCreado = DateTime.Now;
            user.tipoUsuario = (TipoUsuario)userDto.tipoUsuario;

            try
            {
                _userService.Create(user, userDto.password);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        private string GenerateJSONWebToken(User userInfo)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new[]{
                new Claim(JwtRegisteredClaimNames.Email, userInfo.email),
                //new Claim("FechaCreado", userInfo.FechaCreado.ToString("yyyy-MM-dd")),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var token = new JwtSecurityToken(_config["Jwt:Issuer"],
            _config["Jwt:Issuer"],
            claims,
            expires: DateTime.Now.AddMinutes(120),
            signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        // private Usuario AuthenticateUser(Usuario login)
        // {
        //     Usuario user = null;

        //     if (login.username == "Daniel")
        //     {
        //         //user = new Usuario { username = "Daniel", password = "123456" };
        //         user = new Usuario { username = login.username, 
        //                              password = login.password,
        //                              email = login.email,
        //                              FechaCreado = login.FechaCreado
        //                             };

        //     }
        //     return user;
        // }

    }

}