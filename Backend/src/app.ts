import "dotenv/config";
import express from "express";
import bodyParser from "body-parser";
import cors from 'cors';
import swaggerUi from "swagger-ui-express"
import swaggerDocument from "./swagger.json"
import { bootstrap } from "./bootstrap";

const app = express();
const PORT = process.env.PORT || 5000;

// middleware 
app.use(cors());
app.use(express.json());
app.use(express.json({ limit: "50mb" }));       // for JSON requests
app.use(express.urlencoded({ limit: "50mb", extended: true })); // for form submissions
// app.use(bodyParser.json({ limit: "50mb" }));    // optional

// app.use(express.urlencoded({ extended: false }));
// app.use(bodyParser.json())



import path from "path";
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// root route 
app.get("/", (req, res) => {
    res.send("Hello from express");
})


// routes 
import routes from "./routes/index";
app.use("/api", routes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// start server
// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
// })

bootstrap().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    })
})
export default app