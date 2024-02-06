export class UsuariosReadDTO{
    constructor(usuario){
        this.first_name=usuario.nombre.toUpperCase()
        this.last_name=usuario.apellido?usuario.apellido.toUpperCase():"no definido"
        this.email=usuario.email
        this.rol=usuario.rol
    }
}

