export class CustomError extends Error {
    constructor(nombre, mensaje, statusCode, codigoInterno, descripcion = "") {
        super(mensaje);
        this.name = nombre;
        this.codigo = statusCode;
        this.codigoInterno = codigoInterno;
        this.descripcion = descripcion;
    }
}



export const trataError=(error, res)=>{
    if(error instanceof CustomError){
        req.logger.info(`Error (${error.codigo}) - ${error.name.trim()}:  ${error.descripcion}`)
        res.setHeader('Content-Type','application/json');
        return res.status(error.codigo).json({
            error:`${error.message}`,
            detalle:`Error (${error.codigo}) - ${error.name.trim()}:  ${error.descripcion}`.toString() 
        })
    }else{
        res.setHeader('Content-Type','application/json');
        return res.status(500).json({error:`Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`})
    }
}
