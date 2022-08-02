using System;
using System.Collections.Generic;
using System.Linq;

using uahana.Models;

namespace uahana.Services
{

    public interface IUserService
    {
        User Authenticate(string username, string password);
        bool FindUser(string email);
        IEnumerable<User> GetAll();
        User GetByUserName(string username);
        User Create(User user, string password);
        void Update(User user, string password = null);
        void Delete(string username);
    }

    public class UserService : IUserService
    {
        private UahanaContext _context;

        public UserService(UahanaContext context)
        {
            _context = context;
        }

        public User Authenticate(string email, string password)
        {
            if (string.IsNullOrEmpty(email) || string.IsNullOrEmpty(password))
                return null;

            var user = _context.Users.SingleOrDefault(x => x.email == email);

            if (user == null)
                return null;

            if (!VerifyPasswordHash(password, user.passwordHash, user.passwordSalt))
                return null;

            return user;
        }


        public bool FindUser(string email)
        {
            var user = _context.Users.SingleOrDefault(x => x.email == email);

            if (user == null)
                return false;
            return true;
        }

        public User Create(User user, string password)
        {
            if (string.IsNullOrWhiteSpace(password))
                throw new ArgumentException("La contraseña es requerida", "password");

            if (_context.Users.Any(x => x.email == user.email))
                throw new ArgumentException("El usuario para el email " + user.email + " ya existe");

            byte[] passwordHash, passwordSalt;

            CreatePasswordHash(password, out passwordHash, out passwordSalt);

            user.passwordHash = passwordHash;
            user.passwordSalt = passwordSalt;

            _context.Users.Add(user);
            _context.SaveChanges();

            return user;
        }

        public void Delete(string username)
        {
            var user = _context.Users.Find(username);
            user.estado = Estado.Borrado;

            if (user != null)
            {
                _context.Users.Update(user);
                _context.SaveChanges();
            }
        }

        public IEnumerable<User> GetAll()
        {
            return _context.Users;
        }

        public User GetByUserName(string username)
        {
            return _context.Users.FirstOrDefault(x => x.email == username && x.borrado == 'N');
            //return _context.Users.Find(username);
        }

        public void Update(User userParam, string tipoAct)
        {
            var user = GetByUserName(userParam.email);

            if (user == null)
                throw new ArgumentException("Usuario no existe");

            if (tipoAct == "mailValidation")
            {
                user.mailValidado = userParam.mailValidado;
            }
            else if (tipoAct == "datosPersonales")
            {
                user.apellido = userParam.apellido;
                user.nombre = userParam.nombre;
                user.dni = userParam.dni;
                user.fechaNacimiento = userParam.fechaNacimiento;
            }
            else if (tipoAct == "suscripciones")
            {
                user.susExposicion = userParam.susExposicion;
                user.susImagenes = userParam.susImagenes;
            }

            // if (string.IsNullOrWhiteSpace(password))
            // {
            //     byte[] passwordHash, passwordSalt;
            //     CreatePasswordHash(password, out passwordHash, out passwordSalt);
            //     user.passwordHash = passwordHash;
            //     user.passwordSalt = passwordSalt;
            // }

            _context.Users.Update(user);
            _context.SaveChanges();
        }

        //Metodos privados
        private static void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            if (password == null) throw new ArgumentException("password");
            if (string.IsNullOrWhiteSpace(password)) throw new ArgumentException("Valor no puede ser vacío o tener espacios en blanco");

            using (var haac = new System.Security.Cryptography.HMACSHA512())
            {
                passwordSalt = haac.Key;
                passwordHash = haac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            }
        }

        private static bool VerifyPasswordHash(string password, byte[] storedHash, byte[] storedSalt)
        {
            if (password == null) throw new ArgumentException("password");
            if (string.IsNullOrWhiteSpace(password)) throw new ArgumentException("Valor no puede ser vacío o tener espacios en blanco", "password");
            if (storedHash.Length != 64) throw new ArgumentException("Longitud inválida para Password Hash - se esperaban 64 bytes", "passwordHash");
            if (storedSalt.Length != 128) throw new ArgumentException("Longitud inválida para Password Salt - se esperaban 128 bytes", "passwordSalt");

            using (var haac = new System.Security.Cryptography.HMACSHA512(storedSalt))
            {
                var computedHash = haac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
                for (int i = 0; i < computedHash.Length; i++)
                {
                    if (computedHash[i] != storedHash[i]) return false;
                }
            }

            return true;
        }
    }
}