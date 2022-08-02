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
    [ApiController]
    [Route("api/v1/[controller]")]
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
                if (user.mailValidado == 'N')
                {
                    return BadRequest(new { mensaje = "Needs Validation" });
                }
                var tokenString = GenerateJSONWebToken(user);
                response = Ok(new { token = tokenString });
            }
            return response;
        }

        [HttpPost("register")]
        [AllowAnonymous]
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
                if (!_userService.FindUser(userDto.email))
                {
                    var usuarioCreado = _userService.Create(user, userDto.password);
                    return Ok(new { url = sendEmailConfirmation(usuarioCreado) });
                }
                else
                {
                    return BadRequest(new { message = "Ya existe un usuario creado con el mail que intenta usar." });
                }
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("{RegisterEmail}")]
        [AllowAnonymous]
        public IActionResult Login(string userId, string token)
        {
            if (userId == null || token == null)
            {
                return RedirectToAction("index", "home");
            }

            try
            {

                var key = Encoding.ASCII.GetBytes(_config["Jwt:Key2"]);
                var handler = new JwtSecurityTokenHandler();
                var validations = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = false,
                    ValidateAudience = false
                };

                var claims = handler.ValidateToken(token, validations, out var tokenSecure).Claims;

                var email = claims.Where(x => x.Type == ClaimTypes.Email)
                    .FirstOrDefault().Value;

                var usuarioEncontrado = _userService.GetByUserName(email);

                if (usuarioEncontrado == null)
                    return BadRequest();

                if (usuarioEncontrado.usuarioId.ToString() == userId)
                {
                    usuarioEncontrado.mailValidado = 'S';
                    _userService.Update(usuarioEncontrado, "mailValidation");
                    return Ok();
                }
                else
                {
                    return BadRequest();
                }
            }
            catch (Exception ex)
            {
                return StatusCode(408, new { message = ex.Message });
            }
            // }

            // return BadRequest();
        }

        [HttpPut]
        [Authorize]
        public IActionResult Update([FromBody] UserDto userDto)
        {
            User user = new User { };
            user.email = userDto.email;
            user.nombre = userDto.nombre;
            user.apellido = userDto.apellido;
            user.dni = (long)userDto.dni;
            user.fechaNacimiento = (DateTime)userDto.fechaNacimiento;

            try
            {
                _userService.Update(user, "datosPersonales");
                var newToken = GenerateJSONWebToken(user);
                return Ok(new { token = newToken });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }



        private string sendEmailConfirmation(User usuarioCreado)
        {
            var token = GenerateJSONWebTokenEmail(usuarioCreado);
            var confirmationLink = Url.Action() + "Email?userId=" + usuarioCreado.usuarioId + "&token=" + token;

            return confirmationLink;
        }
        private string GenerateJSONWebToken(User userInfo)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new[]{
                new Claim(JwtRegisteredClaimNames.Email, userInfo.email),
                new Claim("Nombre", userInfo.nombre),
                new Claim("Apellido", userInfo.apellido),
                new Claim("DNI", userInfo.dni.ToString()),
                new Claim("FechaNacimiento", userInfo.fechaNacimiento.ToString("yyyy-MM-dd")),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var token = new JwtSecurityToken(_config["Jwt:Issuer"],
            _config["Jwt:Issuer"],
            claims,
            expires: DateTime.Now.AddMinutes(120),
            signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private string GenerateJSONWebTokenEmail(User userInfo)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key2"]));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);
            var claims = new[]{
                new Claim(JwtRegisteredClaimNames.Email, userInfo.email),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var token = new JwtSecurityToken(_config["Jwt:Issuer"],
                        _config["Jwt:Issuer"],
                        claims,
                        expires: DateTime.Now.AddMinutes(360),
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