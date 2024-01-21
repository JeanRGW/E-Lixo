import mongoose from "../config/mongooseConn.js";
import crypto from "crypto";

interface IItem extends mongoose.Document {
	item: {
		categoria: string;
		tipo: string;
		modelo: string;
		addedAt: Date;
	};
	reserva: {
		nome: string;
		data: Date;
		reservaId: string;
	};

	mkReserva(nome: string): void;
	rmReserva(): void;
}

const ItemScheema = new mongoose.Schema<IItem>(
	{
		item: {
			categoria: {
				type: String,
				required: true,
				enum: ["componente", "periferico", "computador", "outros"],
			},
			tipo: {
				type: String,
				required: true,
				enum: [
					"outro",
					"teclado",
					"mouse",
					"armazenamento",
					"memoria",
					"processador",
					"mobo",
					"fonte",
					"cooler",
					"gabinete",
				],
			},
			modelo: {
				type: String,
				default: "N/A",
			},
			addedAt: {
				type: Date,
				default: Date.now(),
			},
		},

		reserva: {
			nome: {
				type: String,
				default: null,
			},
			data: {
				type: Date,
				default: null,
			},
			reservaId: {
				type: String,
				default: null,
				index: true,
			},
		},
	},
	{ strict: true }
);

/**
 * Mongoose "Item" method to create a reservation
 * @param {string} nome
 */
ItemScheema.methods.mkReserva = function mkReserva(nome: string) {
	this.reserva.nome = nome;
	this.reserva.data = Date.now();
	this.reserva.reservaId = crypto.randomBytes(8).toString("hex"); // ID aleatório
};

ItemScheema.methods.rmReserva = function rmReserva() {
	this.reserva.nome = null;
	this.reserva.data = null;
	this.reserva.reservaId = null;
};

const Item = mongoose.model<IItem>("Item", ItemScheema);

export default Item;
