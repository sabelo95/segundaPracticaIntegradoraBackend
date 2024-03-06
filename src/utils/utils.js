import { fileURLToPath } from "url";
import { dirname } from "path";
import bcrypt from "bcrypt";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default __dirname;

export const creaHash = (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(10));
export const validaPassword = (usuario, password) =>
  bcrypt.compareSync(password, usuario.password);

export const auth = (req, res, next) => {
  if (!req.session.usuario) {
    res.redirect("/login");
    return;
  }

  next();
};

export const authAdmin = (req, res, next) => {
  if (req.session.usuario.rol === "admin" || req.session.usuario.rol === "premium") {
    next();
  } else {
    res.status(200).json({ message: "Solo el administrador o usuarios premium tienen acceso" });
  }
};


export const authUser = (req, res, next) => {
  if (!(req.session.usuario.rol === "usuario")) {
    res.status(200).json({ message: "Solo los usuarios tienen acceso" });
    return;
  }

  next();
};

export const authPremium = (req, res, next) => {
  if (req.session.usuario.rol === "premium"){
    next();
  }
  res.status(200).json({ message: "Solo los usuarios premium tienen acceso " });
    return;
 
};
