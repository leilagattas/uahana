using Microsoft.EntityFrameworkCore;
using System.Reflection;

namespace uahana.Models
{
    public class UahanaContext : DbContext
    {
        public DbSet<User> Users { get; set; }
        public DbSet<Rubro> Rubros { get; set; }

        public UahanaContext(DbContextOptions<UahanaContext> options)
        : base(options)
        { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
        }
    }
}