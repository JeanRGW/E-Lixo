import "dotenv/config";

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import routes from "./routes/routes.js";
import errorHandler from "./middlewares/errorHandler.js";

// Limpar reservas imediato e a cada meia noite
import "./utils/limparReservas.js";

// Verificações de ambiente
if (!process.env.URL) {
	throw new Error("URL não especificado em .env");
}

if (!process.env.SECRET) {
	// Caso não seja especificado será usado 'Development'
	console.error("SECRET não especificado no env, para produção defina um valor seguro");
}

const PORT: number = parseInt(process.env.PORT || "3000");
console.log(`Usando a porta ${PORT}, para alterar defina outro valor no env para 'PORT'`);

// Express
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());

app.use(express.static("./public"));
app.use("/", routes);

// Error Handling
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
