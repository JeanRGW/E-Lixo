import mongoose from "../config/mongooseConn.js";
import crypto from "crypto";
const ItemScheema = new mongoose.Schema({
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
}, { strict: true });
ItemScheema.methods.mkReserva = function mkReserva(nome) {
    this.reserva.nome = nome;
    this.reserva.data = Date.now();
    this.reserva.reservaId = crypto.randomBytes(8).toString("hex");
};
ItemScheema.methods.rmReserva = function rmReserva() {
    this.reserva.nome = null;
    this.reserva.data = null;
    this.reserva.reservaId = null;
};
const Item = mongoose.model("Item", ItemScheema);
export default Item;
