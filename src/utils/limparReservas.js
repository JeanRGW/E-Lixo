import { Item } from "../models/models.js";
import cron from "node-cron";

/**
 * Clean expired reservations from database
 */
async function limparReservas() {
	let dataMax = new Date();
	dataMax.setDate(dataMax.getDate() - 7); // (Data atual - 7 dias), reservas anteriores são removidas

	await Item.updateMany(
		{ "reserva.reservaId": { $ne: null }, "reserva.data": { $lt: dataMax } },
		{ $set: { "reserva.nome": null, "reserva.data": null, "reserva.reservaId": null } }
	);

	console.log("Reservas limpas");
}

// Executar toda meia-noite
cron.schedule("0 0 0 * * *", () => {
	limparReservas();
});

limparReservas();

export default limparReservas;
