import express from "express";
import {  products } from "../services/mocking.services.js";

const router = express.Router();

// Ruta para obtener todos los productos
router.get("/", (req, res) => {
    
    res.send(products); // Por ahora, solo se envía un mensaje de prueba
});

export { router };