using System;
using System.ComponentModel.DataAnnotations;

namespace uahana.Models
{
    public class User
    {
        public long usuarioId { get; set; }
        public string nombre { get; set; }
        public string apellido { get; set; }
        [Key]
        [Required]
        [Display(Name = "email")]
        [StringLength(40, ErrorMessage = "El valor para el {0} debe contener al menos {2} y máximo {1} caracteres", MinimumLength = 10)]
        public string email { get; set; }
        public long dni { get; set; }
        public DateTime fechaNacimiento { get; set; }
        public DateTime fechaCreado { get; set; }
        public TipoUsuario tipoUsuario { get; set; } = 0;
        public Estado estado { get; set; } = 0;
        public SuscripcionImagenes susImagenes { get; set; } = 0;
        public SuscripcionExposicion susExposicion { get; set; } = 0;
        public char requiereClave { get; set; } = 'S';
        public byte[] passwordHash { get; set; }
        public byte[] passwordSalt { get; set; }
    }
}