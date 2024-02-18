import { trataError } from "../utils/CustomErrors.js"

export const errorHandler=(error, req, res, next)=>{
    if(error){
        trataError(error, res)
    }

    next()
}
