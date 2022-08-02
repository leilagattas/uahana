using System;
using System.ComponentModel.DataAnnotations;

namespace uahana.Models
{
    public class UserDto
    {

        [Key]
        [Required]
        [Display(Name = "email")]
        [StringLength(40, ErrorMessage = "El valor para el {0} debe contener al menos {2} y máximo {1} caracteres", MinimumLength = 6)]
        public string email { get; set; }
        public string? password { get; set; }
        public string? nombre { get; set; }
        public string? apellido { get; set; }
        [DataType(DataType.EmailAddress)]
        public long? dni { get; set; }
        [DataType(DataType.Date)]
        public DateTime? fechaNacimiento { get; set; }
        [DataType(DataType.Date)]
        public DateTime? fechaCreado { get; set; }
        public TipoUsuario? tipoUsuario { get; set; }

    }
}