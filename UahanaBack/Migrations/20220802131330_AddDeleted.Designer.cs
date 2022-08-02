﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using uahana.Models;

#nullable disable

namespace uahana.Migrations
{
    [DbContext(typeof(UahanaContext))]
    [Migration("20220802131330_AddDeleted")]
    partial class AddDeleted
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "6.0.7")
                .HasAnnotation("Relational:MaxIdentifierLength", 64);

            modelBuilder.Entity("uahana.Models.Rubro", b =>
                {
                    b.Property<long?>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bigint");

                    b.Property<string>("Tipo")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.HasKey("Id");

                    b.ToTable("Rubros");

                    b.HasData(
                        new
                        {
                            Id = 1L,
                            Tipo = "Comida"
                        },
                        new
                        {
                            Id = 2L,
                            Tipo = "Hogar"
                        },
                        new
                        {
                            Id = 3L,
                            Tipo = "Educaciòn"
                        });
                });

            modelBuilder.Entity("uahana.Models.User", b =>
                {
                    b.Property<long>("usuarioId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bigint");

                    b.Property<string>("email")
                        .HasColumnType("varchar(255)");

                    b.Property<string>("apellido")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<string>("borrado")
                        .IsRequired()
                        .HasColumnType("varchar(1)");

                    b.Property<long>("dni")
                        .HasColumnType("bigint");

                    b.Property<int>("estado")
                        .HasColumnType("int");

                    b.Property<DateTime>("fechaCreado")
                        .HasColumnType("datetime(6)");

                    b.Property<DateTime>("fechaNacimiento")
                        .HasColumnType("datetime(6)");

                    b.Property<string>("mailValidado")
                        .IsRequired()
                        .HasColumnType("varchar(1)");

                    b.Property<string>("nombre")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<byte[]>("passwordHash")
                        .IsRequired()
                        .HasColumnType("longblob");

                    b.Property<byte[]>("passwordSalt")
                        .IsRequired()
                        .HasColumnType("longblob");

                    b.Property<string>("requiereClave")
                        .IsRequired()
                        .HasColumnType("varchar(1)");

                    b.Property<int>("susExposicion")
                        .HasColumnType("int");

                    b.Property<int>("susImagenes")
                        .HasColumnType("int");

                    b.Property<int>("tipoUsuario")
                        .HasColumnType("int");

                    b.HasKey("usuarioId", "email");

                    b.ToTable("Users");
                });
#pragma warning restore 612, 618
        }
    }
}
