import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import routes from "./routes/routes.js";
import errorHandler from "./middlewares/errorHandler.js";
import "./utils/limparReservas.js";
if (!process.env.URL) {
    throw new Error("URL não especificado em .env");
}
if (!process.env.SECRET) {
    console.error("SECRET não especificado no env, para produção defina um valor seguro");
}
const PORT = parseInt(process.env.PORT || "3000");
console.log(`Usando a porta ${PORT}, para alterar defina outro valor no env para 'PORT'`);
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());
app.use(express.static("./public"));
app.use("/", routes);
app.use(errorHandler);
const server = app.listen(PORT, () => {
    console.log(`App ouvindo a porta ${PORT}`);
});
process.on("SIGINT", () => {
    console.log("SIGINT recebido. Fechando o server.");
    server.close(() => {
        console.log("Server fechado. Encerrando o processo.");
        process.exit(0);
    });
});
