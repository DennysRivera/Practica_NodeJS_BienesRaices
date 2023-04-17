const formLogin = (req, res) => {
  res.render("auth/login", {
    page: "Iniciar sesión"
  });
};

const formSignup = (req, res) => {
    res.render("auth/signup", {
      page: "Crear cuenta"
    });
  };

  const formForgotPassword = (req, res) => {
    res.render("auth/forgot-password", {
      page: "Olvidé mi contraseña"
    });
  };

export {
    formLogin,
    formSignup,
    formForgotPassword
}