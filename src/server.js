import express from "express";

const PORT = 4000;

const app = express();

const logger = (req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
};

const handleHome = (req, res) => {
  return res.send("I still love you!");
};

app.use(logger);
app.get("/", handleHome);

const handleListening = () =>
  console.log(`Server listening on port http://localhost:${PORT}`);

app.listen(PORT, handleListening);
