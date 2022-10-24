const express = require("express");
require("dotenv").config();
const app = express();
const userRoute = require("./routes/users.route");

const morgan = require("morgan");
const errMiddleware = require("./middlewares/err.middleware");
const AppError = require("./utils/app-error");

//Logger Middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
//body-parser middleware
app.use(express.json());

app.use("/users", userRoute);

app.all("*", (_, __, next) => {
  next(new AppError("Route not found", 404));
});

app.use(errMiddleware);

app.listen(process.env.PORT_EXPRESS, () => {
  console.log("server is listening to port: " + process.env.PORT_EXPRESS);
});
