import express from "express";
import jwtCheck from "../middlewares/jwtCheck.js";
import * as Models from "../models/models.js";
import jwt from "jsonwebtoken";

const SECRET = process.env.SECRET || "Development";

const router = express.Router();

// user, pass
router.post("/login", async (req, res, next) => {
	try {
		const { user, pass } = req.body || null;

		if (user && pass) {
			const admin = await Models.Admin.findOne({ user: user, pass: pass });

			if (admin) {
				const token = jwt.sign({ id: admin._id }, SECRET, { expiresIn: "1h" });

				res.status(200).cookie("token", token).json(token);
				// {httpOnly: true}
			} else {
				res.status(403).send("Credenciais incorretas!");
			}
		} else {
			res.status(400).send("Insira usuário e senha.");
		}
	} catch (err) {
		next(err);
	}
});

// authKey, categoria, tipo, modelo ? qty
router.post("/register", jwtCheck, async (req, res, next) => {
	try {
		console.log(req.decodedToken);

		let data = req.body;

		const qty = data.qty || 1;

		delete data.qty;

		for (let i = 0; i < qty; i++) {
			const newItem = new Models.Item({ ...data });
			newItem.save();
		}

		res.status(200).send("Objeto inserido com sucesso!");
	} catch (err) {
		next(err);
	}
});

// authkey
router.get("/listaAdmin", jwtCheck, async (req, res, next) => {
	try {
		const lista = await Models.Item.find({ "reserva.nome": { $ne: null } });
		res.status(200).send(lista);
	} catch (err) {
		next(err);
	}
});

// authKey
router.post("/reservas", jwtCheck, async (req, res, next) => {
	try {
		const data = req.body;

		const lista = await Models.Item.find({ "reserva.nome": { $ne: null } });

		res.json(lista);
	} catch (err) {
		next(err);
	}
});

// reservaId // GET não é exatamente o adequado, mas foi usado por comodidade
router.get("/entregue", async (req, res, next) => {
	try {
		if (req.query.reservaId) {
			const reservaId = req.query.reservaId;
			const item = await Models.Item.findOne({
				"reserva.reservaId": reservaId,
			});

			if (item) {
				await Models.Item.findOneAndDelete({ "reserva.reservaId": reservaId });
				res.status(200).send("Objeto entregue e removido com sucesso!");
			} else {
				res.status(400).send("Reserva não encontrada, não existe ou já foi entregue");
			}
		} else {
			res.status(400).send("Fornecer reservaId como parâmetro");
		}
	} catch (err) {
		next(err);
	}
});

export default router;
