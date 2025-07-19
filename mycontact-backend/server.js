require("dotenv").config();
const express = require("express");
const errorHandler = require("./middleware/errorHandler");
const contactRouter = require("./routes/contactRoutes");
const userRouter = require("./routes/userRoutes");
const connectDb = require("./config/dbConnection");
const app = express();
connectDb();

const PORT = process.env.PORT || 5000;
//for handling post request we need json parser
app.use(express.json());

//route path
app.use("/api/contacts", contactRouter);
app.use("/api/users", userRouter);

//for handling error using middleware need to add
app.use(errorHandler);

//starting server
app.listen(PORT, () => {
  console.log(`Server is listening, ${PORT}`);
});
