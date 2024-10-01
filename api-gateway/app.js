const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const rateLimiter = require("./middlewares/ratelimiter");

const app = express();
app.use(express.json());

const userService = createProxyMiddleware({
    target: 'http://localhost:3001',
    changeOrigin: true,
    pathRewrite: { '^/user-service': '' },
    timeout: 5000, // Set a 5-second timeout
    onError: (err, req, res) => {
        res.status(500).json({ message: "Proxy error or target service unavailable" });
    }
});

app.use('/user-service', rateLimiter, userService);

app.listen(3000, () => {
    console.log("Listening on port 3000");
});
