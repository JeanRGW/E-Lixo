var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import express from "express";
import jwtCheck from "../middlewares/jwtCheck.js";
import * as Models from "../models/models.js";
import jwt from "jsonwebtoken";
const SECRET = process.env.SECRET || "Development";
const router = express.Router();
router.post("/login", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user, pass } = req.body || null;
        if (user && pass) {
            const admin = yield Models.Admin.findOne({ user: user, pass: pass });
            if (admin) {
                const token = jwt.sign({ id: admin._id }, SECRET, { expiresIn: "1h" });
                res.status(200).cookie("token", token).json(token);
            }
            else {
                res.status(403).send("Credenciais incorretas!");
            }
        }
        else {
            res.status(400).send("Insira usuário e senha.");
        }
    }
    catch (err) {
        next(err);
    }
}));
router.post("/register", jwtCheck, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req.decodedToken);
        let data = req.body;
        const qty = data.qty || 1;
        delete data.qty;
        for (let i = 0; i < qty; i++) {
            const newItem = new Models.Item(Object.assign({}, data));
            newItem.save();
        }
        res.status(200).send("Objeto inserido com sucesso!");
    }
    catch (err) {
        next(err);
    }
}));
router.get("/listaAdmin", jwtCheck, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const lista = yield Models.Item.find({ "reserva.nome": { $ne: null } });
        res.status(200).send(lista);
    }
    catch (err) {
        next(err);
    }
}));
router.post("/reservas", jwtCheck, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = req.body;
        const lista = yield Models.Item.find({ "reserva.nome": { $ne: null } });
        res.json(lista);
    }
    catch (err) {
        next(err);
    }
}));
router.get("/entregue", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.query.reservaId) {
            const reservaId = req.query.reservaId;
            const item = yield Models.Item.findOne({
                "reserva.reservaId": reservaId,
            });
            if (item) {
                yield Models.Item.findOneAndDelete({ "reserva.reservaId": reservaId });
                res.status(200).send("Objeto entregue e removido com sucesso!");
            }
            else {
                res.status(400).send("Reserva não encontrada, não existe ou já foi entregue");
            }
        }
        else {
            res.status(400).send("Fornecer reservaId como parâmetro");
        }
    }
    catch (err) {
        next(err);
    }
}));
export default router;
