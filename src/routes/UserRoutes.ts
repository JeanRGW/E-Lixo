import express from "express";
import * as Models from "../models/models.js";
import generatePDF from "../utils/generatePDFnew.js";

const router = express.Router();

router.get("/lista", async (req, res, next) => {
	try {
		const lista = await Models.Item.find({ "reserva.reservaId": null }, { reserva: 0 });
		res.json(lista);
	} catch (err) {
		next(err);
	}
});

// nome, objectId
router.post("/reservar", async (req, res, next) => {
	try {
		const { nome, objectId } = req.body;

		if (!nome || !objectId) {
			return res.status(400).send("Reserva Inválida: Faltando campos obrigatórios");
		}

		let item = await Models.Item.findOne({ _id: objectId });

		if (!item) {
			return res.status(404).send("Item não encontrado");
		}

		if (item.reserva.nome != null) {
			return res.status(403).send("Item já reservado");
		}

		item.mkReserva(nome);
		await item.save();

		return res.status(200).send("Item reservado com sucesso!");
	} catch (err) {
		next(err);
	}
});

// reservaId
router.get("/reserva", async (req, res, next) => {
	try {
		const { reservaId } = req.query;
		if (!reservaId) {
			res.status(404).send("Reserva não encontrada.");
		} else {
			const item = await Models.Item.findOne({ "reserva.reservaId": reservaId });
			if (!item) {
				res.status(404).send("Reserva não encontrada.");
			} else {
				generatePDF(item.reserva).then((pdf) => {
					res.setHeader("Content-Type", "application/pdf");
					res.status(200).send(pdf);
				});
			}
		}
	} catch (err) {
		next(err);
	}
});

export default router;
