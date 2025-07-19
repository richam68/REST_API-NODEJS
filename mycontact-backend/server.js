require("dotenv").config();
const express = require("express");
const errorHandler = require("./middleware/errorHandler");
const contactRouter = require("./routes/contactRoutes");
const userRouter = require("./routes/userRoutes");
const connectDb = require("./config/dbConnection");

// Swagger setup
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");

// CORS setup
const cors = require("cors");

const app = express();
connectDb();

const PORT = process.env.PORT || 5000;
//for handling post request we need json parser
app.use(express.json());

app.use(cors());

// Mount Swagger Docs before routes
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

//route path
app.use("/api/contacts", contactRouter);
app.use("/api/users", userRouter);

//for handling error using middleware need to add
app.use(errorHandler);

//starting server
app.listen(PORT, () => {
  console.log(`Server is listening, ${PORT}`);
  console.log(`Swagger docs: http://localhost:${PORT}/api-docs`);
});
