using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace uahana.Models
{
    public class RubroEntityTypeConfiguration : IEntityTypeConfiguration<Rubro>
    {
        public void Configure(EntityTypeBuilder<Rubro> builder)
        {
            builder
              .HasData(
                   new Rubro { Id = 1, Tipo = "Comida" },
                   new Rubro { Id = 2, Tipo = "Hogar" },
                   new Rubro { Id = 3, Tipo = "Educaciòn" });
        }
    }

}