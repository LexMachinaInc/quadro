const proxy = require("http-proxy-middleware");

module.exports = (app) => {
  app.use(proxy("/login", { target: "http://localhost:8080", ws: true }));
  app.use(
    proxy("/authenticated", { target: "http://localhost:8080", ws: true }),
  );
  app.use(proxy("/logout", { target: "http://localhost:8080", ws: true }));
  app.use(
    proxy("/oauth/redirect", { target: "http://localhost:8080", ws: true }),
  );
};
