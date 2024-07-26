import boom from "boom";
import cors from "cors";
import express, { json, urlencoded } from "express";
import fs from "fs";
import helmet from "helmet";
import morgan from "morgan";

// import config from "./config/";

// App
const app = express();
const pkg = JSON.parse(fs.readFileSync("package.json", "utf-8"));
const port = process.env.PORT ?? 3000;

// Settings
app.set("pkg", pkg);
app.set("port", port);

// Middlewares
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(morgan("dev"));

// Security
const whitelist: string[] = ["http://localhost:5173", "http://localhost:3000"];
const options: cors.CorsOptions = {
  exposedHeaders: "Authorization, Content-Disposition",
  origin: (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void,
  ) => {
    if (whitelist.includes(origin as string) || !origin) {
      callback(null, true);
    } else {
      callback(new Error("no permitido"));
    }
  },
};
app.use(cors(options));

// Redirect
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to my API: MiTren",
    name: app.get("pkg").name,
    version: app.get("pkg").version,
    description: app.get("pkg").description,
    repository: app.get("pkg").repository.url,
    license: app.get("pkg").license,
    author: app.get("pkg").author,
    homepage: app.get("pkg").homepage,
  });
});

// Verify router
app.use((req, res) => {
  const {
    output: { statusCode, payload },
  } = boom.notFound("Página no encontrada");

  res.status(statusCode).json(payload);
});

export default app;
