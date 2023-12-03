import { check, validationResult } from "express-validator";
import User from "../models/User.js";
import { generateId, generateJWT } from "../helpers/tokens.js";
import { emailSignup, emailForgotPassword } from "../helpers/email.js";
import bcrypt from "bcrypt";

const formLogin = (req, res) => {
  res.render("auth/login", {
    page: "Iniciar sesión",
    csrfToken: req.csrfToken(),
  });
};

const authenticateUser = async (req, res) => {
  await check("email")
    .isEmail()
    .withMessage("Por favor, ingrese un email válido")
    .run(req);
  await check("password")
    .notEmpty()
    .withMessage("Por favor, ingrese una contraseña")
    .run(req);

    let result = validationResult(req);

    if (!result.isEmpty()) {
      return res.render("auth/login", {
        page: "Iniciar sesión",
        csrfToken: req.csrfToken(),
        errors: result.array()
      });
    }

    const { email, password } = req.body;

    const user = await User.findOne({where: {email} });

    if (!user) {
      return res.render("auth/login", {
        page: "Iniciar sesión",
        csrfToken: req.csrfToken(),
        errors: [{ msg: "No se encontró el usuario" }]
      });
    }

    if(!user.confirmed){
      return res.render("auth/login", {
        page: "Iniciar sesión",
        csrfToken: req.csrfToken(),
        errors: [{ msg: "El usuario no ha sido confirmado" }]
      });
    }

    if(!user.verifyPassword(password)) {
      return res.render("auth/login", {
        page: "Iniciar sesión",
        csrfToken: req.csrfToken(),
        errors: [{ msg: "Contraseña incorrecta" }]
      });
    }

    const token = generateJWT({id: user.id, name: user.name});

    return res.cookie("_token", token, {
      httpOnly: true
    }).redirect("/properties/my-properties");
};

const logout = (req, res) => {
  return res.clearCookie("_token").status(200).redirect("/auth/login")
}

const formSignup = (req, res) => {
  res.render("auth/signup", {
    page: "Crear cuenta",
    csrfToken: req.csrfToken(),
  });
};

const registerUser = async (req, res) => {
  await check("name")
    .notEmpty()
    .withMessage("Debe ingresar un nombre")
    .run(req);
  await check("email")
    .isEmail()
    .withMessage("Por favor, ingrese un email válido")
    .run(req);
  await check('password')
    .isLength({ min: 6 })
    .withMessage("La contraseña debe tener más de 6 caracteres")
    .run(req);
  await check('repeat_password').equals(req.body.password).withMessage("Las contraseñas son diferentes").run(req);

  let result = validationResult(req);
  console.log(req.body.password === req.body.repeat_password)

  const { name, email, password } = req.body;

  if (!result.isEmpty()) {
    console.log(result)
    return res.render("auth/signup", {
      page: "Crear cuenta",
      csrfToken: req.csrfToken(),
      errors: result.array(),
      user: {
        name: name,
        email: email,
        password: password,
        repeat_password: req.body.repeat_password,
      },
    });
  }

  const checkUserExist = await User.findOne({
    where: {
      email: email,
    },
  });

  if (checkUserExist) {
    return res.render("auth/signup", {
      page: "Crear cuenta",
      csrfToken: req.csrfToken(),
      errors: [{ msg: "Usuario ya está registrado" }],
      user: {
        name: name,
        email: email,
        password: password,
        repeat_password: req.body.repeat_password,
      },
    });
  }

  const user = await User.create({
    name,
    email,
    password,
    token: generateId(),
  });

  emailSignup({
    name: user.name,
    email: user.email,
    token: user.token,
  });

  res.render("templates/message", {
    page: "Cuenta creada correctamente",
    message: "Se ha enviado un correo de confirmación, presiona en el enlace",
    csrfToken: req.csrfToken(),
  });
};

const confirmAccount = async (req, res) => {
  const { token } = req.params;

  const user = await User.findOne({ where: { token } });

  if (!user) {
    return res.render("auth/confirm-account", {
      page: "Error al confirmar tu cuenta",
      csrfToken: req.csrfToken(),
      mensaje: "Hubo un error al confirmar tu cuenta, intenta de nuevo",
      error: true,
    });
  }

  user.token = null;
  user.confirmed = true;

  await user.save();

  res.render("auth/confirm-account", {
    page: "Cuenta confirmada",
    mensaje: "La cuenta ha sido confirmada correctamente",
    csrfToken: req.csrfToken(),
  });
};

const formForgotPassword = (req, res) => {
  res.render("auth/forgot-password", {
    page: "Olvidé mi contraseña",
    csrfToken: req.csrfToken(),
  });
};

const resetPassword = async (req, res) => {
  await check("email")
    .isEmail()
    .withMessage("Por favor, ingrese un email válido")
    .run(req);

  let result = validationResult(req);

  const { email } = req.body;

  if (!result.isEmpty()) {
    return res.render("auth/forgot-password", {
      page: "Olvidé mi contraseña",
      csrfToken: req.csrfToken(),
      errors: result.array(),
    });
  }

  const user = await User.findOne({ where: { email } });

  if (!user) {
    return res.render("auth/forgot-password", {
      page: "Olvidé mi contraseña",
      csrfToken: req.csrfToken(),
      errors: [{ msg: "No se encontró ese email" }],
    });
  }

  user.token = generateId();
  await user.save();

  emailForgotPassword({
    name: user.name,
    email: user.email,
    token: user.token,
  });

  res.render("templates/message", {
    page: "Cambio de contraeña",
    message: "Se ha enviado un correo con las instrucciones para el cambio de contraseña",
    csrfToken: req.csrfToken()
  });
};

const confirmToken = async (req, res) => {
  const { token } = req.params;
  const user = await User.findOne({ where: {token} });

  if (!user) {
    return res.render("auth/confirm-account", {
      page: "Restaurar contraseña",
      csrfToken: req.csrfToken(),
      message: "Hubo un error al validar la información, intenta de nuevo",
      error: true,
    });
  }

  res.render("auth/reset-password", {
    page: "Restaurar contraseña",
    csrfToken: req.csrfToken()
  });
};

const newPassword = async (req, res) => {
  await check("password")
    .isLength({ min: 6 })
    .withMessage("La contraseña debe tener más de 6 caracteres")
    .run(req);

    const result = validationResult(req);

    if(!result.isEmpty()){
      res.render("auth/reset-password", {
        page: "Restaurar contraseña",
        csrfToken: req.csrfToken(),
        errors: result.array()
      });
    }

    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({where: {token} });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    user.token = null;

    await user.save();

    res.render("auth/confirm-account", {
      page: "Contraseña restablecida",
      message: "Se ha establecido la nueva contraseña",
      csrfToken: req.csrfToken()
    });
};

export {
  formLogin,
  authenticateUser,
  logout,
  formSignup,
  registerUser,
  confirmAccount,
  formForgotPassword,
  resetPassword,
  confirmToken,
  newPassword,
};
