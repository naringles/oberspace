const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    createProxyMiddleware("/api/**", {
      target: "http://localhost:3000",
      changeOrigin: true,
    })
  );

  app.use(
    createProxyMiddleware("/user/auth/**", {
      target: "http://localhost:3000",
      changeOrigin: true,
    })
  );
  app.use(
    createProxyMiddleware("/user/add/**", {
      target: "http://localhost:3000",
      changeOrigin: true,
    })
  );
  app.use(
    createProxyMiddleware("/action/**", {
      target: "http://localhost:3000",
      changeOrigin: true,
    })
  );

  app.use(
    createProxyMiddleware("/user/data/read", {
      target: "http://localhost:3000",
      changeOrigin: true,
    })
  );
  app.use(
    createProxyMiddleware("/user/auth/logout", {
      target: "http://localhost:3000",
      changeOrigin: true,
    })
  );
};
