using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace uahana.Models
{
    public class UserEntityTypeConfiguration : IEntityTypeConfiguration<User>
    {
        public void Configure(EntityTypeBuilder<User> builder)
        {
            builder
              .HasKey(x => new { x.usuarioId, x.email });

            builder
                .Property(x => x.usuarioId)
                .ValueGeneratedOnAdd();

        }
    }

}