import {fileURLToPath} from 'url';
import { dirname } from 'path';
import winston from 'winston'
import { config } from '../config/config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default __dirname;






 export const  logger=winston.createLogger(
    {
        levels:{fatal:0,error:1,warning:2,info:3, http:4, debug:5},
        transports:[
            new winston.transports.Console(
                {
                    level: "debug",
                    format: winston.format.combine(
                        winston.format.colorize({
                            colors:{fatal:"red", error:"yellow", warning:"green"}
                        }),
                        winston.format.simple()
                    )
                }
            ),

             
            
        ]
    }
)

const transporteProd=new winston.transports.Console(
    {
        level:"info",
        format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json()
        )
    }
)

const transporteFile=new winston.transports.File(
    {
        level:"error",
        filename:"./src/logs/errorLogs.log",
        format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json()
        )
    }
)

if(config.MODE==="production"){
    console.log("ingreso")
    logger.add(transporteFile,transporteProd)
}


export const middLogg=(req, res, next)=>{
    req.logger=logger
   

    next()
}


