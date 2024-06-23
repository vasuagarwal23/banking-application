import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

// routes import
import customerRouter from './routes/customer.routes.js';

const app = express();

//  __dirname  not available when using ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "16kb" })); // extended: support nested objects or arrays in the URL-encoded format
app.use(express.static("public")); // This directory will contain all our static files like HTML, images, CSS, JavaScript, etc.
app.use(cookieParser());

//http://localhost:8000/registerCustomer
// Set the view engine to ejs
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Route to render the registration form
app.get('/registerCustomer', (req, res) => {
    res.render('registerCustomer');
});    

// Routes declaration
app.use("/api/v1/customers", customerRouter);

export { app };
