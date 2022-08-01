export interface User {
    nombre: string,
    apellido: string,
    fechaNacimiento: Date,
    dni: bigint,
    email: string,
    password: string,
    tipoUsuario: number
}