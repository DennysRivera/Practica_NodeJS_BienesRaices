const formLogin = (req, res) => {
  res.render("auth/login");
};

const formSignup = (req, res) => {
    res.render("auth/signup");
  };

export {
    formLogin,
    formSignup
}