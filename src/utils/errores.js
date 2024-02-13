import os from 'os'

// export const errorArgumentos=(usuario)=>{
export const errorArgumentos=(campos)=>{

    // let {name, ...otros}=usuario

    return `
Error en argumentos:
Argumentos obligatorios: title, description, code, price, stock, category
recibido ${JSON.stringify(campos)}   


Fecha: ${new Date().toUTCString()}
Usuario: ${os.userInfo().username}
`

}

export const errorArgumentosDel=(campos)=>{

    // let {name, ...otros}=usuario

    return `
Error en argumentos:
Argumentos obligatorios: id
recibido ${JSON.stringify(campos)}   


Fecha: ${new Date().toUTCString()}
Usuario: ${os.userInfo().username}
`

}

export const errorArgumentosDB=()=>{

    

    return `
Error al tratar de conectar a la base de datos


Fecha: ${new Date().toUTCString()}
Usuario: ${os.userInfo().username}
`

}

