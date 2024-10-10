const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config({ path: "config.env" });
const path = require("path");
const ApiError = require("./utils/apiError");
const dbConnection = require("./config/database");
const categoryRoute = require("./routes/categoryRoute");
const productRoute = require("./routes/productRoute");
const authRoute = require("./routes/authRoute");
const infoRoute = require("./routes/infoRoute");
const orderRoute = require("./routes/orderRoute");
const cartRoute = require("./routes/cartRoute");
const globalError = require("./middleware/errorMiddleware");
const userRoute = require("./routes/userRoute");
const FavListRoute = require("./routes/FavListRoute");
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize Google Gemini
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENAI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// dbConnection
dbConnection();

// express app
const app = express();

app.use(cors());
app.options("*", cors());

// middlewares
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`mode: ${process.env.NODE_ENV}`);
}

// Mount Routes
app.use("/api/v1/categories", categoryRoute);
app.use("/api/v1/products", productRoute);
app.use("/", authRoute);
app.use("/api/v1/Informations", infoRoute);
app.use("/api/v1/users", userRoute);
app.use("/api/v1/FavList", FavListRoute);
app.use("/api/v1/orders", orderRoute);
app.use("/api/v1/cart", cartRoute);

// Route to interact with Google Gemini
app.post("/chat", async (req, res) => {
  const { message } = req.body;
  try {
    const result = await model.generateContent(message);
    const response = await result.response;
    const text = response.text();
    res.json({ response: text });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error communicating with Google Gemini");
  }
});

// Paypal client ID from .env file, send back to front end
app.get("/api/config/paypal", (req, res) => {
  res.send(process.env.PAYPAL_CLIENT_ID || "sb");
});

// Handle 404
app.all("*", (req, res, next) => {
  next(new ApiError(`Cannot Find This Route: ${req.originalUrl}`, 404));
});

// Global Error Handling Middleware For Express
app.use(globalError);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`App Is Running On ${PORT}`);
});

// Handle Rejection Outside Express
process.on("unhandledRejection", (err) => {
  console.error(`UnhandledRejection Errors: ${err.name} | ${err.message}`);
  process.exit(1);
});