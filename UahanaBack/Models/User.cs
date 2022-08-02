using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace uahana.Models
{
    public class User
    {
        public long usuarioId { get; set; }
        public string nombre { get; set; }
        public string apellido { get; set; }
        public string email { get; set; }
        public long dni { get; set; }
        public DateTime fechaNacimiento { get; set; }
        public DateTime fechaCreado { get; set; }
        public TipoUsuario tipoUsuario { get; set; } = 0;
        public Estado estado { get; set; } = 0;
        public SuscripcionImagenes susImagenes { get; set; } = 0;
        public SuscripcionExposicion susExposicion { get; set; } = 0;
        public char mailValidado { get; set; } = 'N';
        public char requiereClave { get; set; } = 'S';
        public char borrado { get; set; } = 'N';
        public byte[] passwordHash { get; set; }
        public byte[] passwordSalt { get; set; }
    }
}