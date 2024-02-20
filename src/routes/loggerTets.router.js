import express from "express";


const router = express.Router();

// Ruta para obtener todos los productos
router.get("/", (req, res) => {
    
    req.logger.debug('Este es un mensaje de debug');
    req.logger.info('Este es un mensaje de información');
    req.logger.warning('Este es un mensaje de advertencia');
    req.logger.error('Este es un mensaje de error');
    req.logger.http('Este es un mensaje de http');
    req.logger.fatal('Este es un mensaje fatal');

    res.send('Logs generados, revisa la consola o los archivos de registro.')
});

export { router };