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
import * as Models from "../models/models.js";
import generatePDF from "../utils/generatePDFnew.js";
const router = express.Router();
router.get("/lista", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const lista = yield Models.Item.find({ "reserva.reservaId": null }, { reserva: 0 });
        res.json(lista);
    }
    catch (err) {
        next(err);
    }
}));
router.post("/reservar", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { nome, objectId } = req.body;
        if (!nome || !objectId) {
            return res.status(400).send("Reserva Inválida: Faltando campos obrigatórios");
        }
        let item = yield Models.Item.findOne({ _id: objectId });
        if (!item) {
            return res.status(404).send("Item não encontrado");
        }
        if (item.reserva.nome != null) {
            return res.status(403).send("Item já reservado");
        }
        item.mkReserva(nome);
        yield item.save();
        return res.status(200).send("Item reservado com sucesso!");
    }
    catch (err) {
        next(err);
    }
}));
router.get("/reserva", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { reservaId } = req.query;
        if (!reservaId) {
            res.status(404).send("Reserva não encontrada.");
        }
        else {
            const item = yield Models.Item.findOne({ "reserva.reservaId": reservaId });
            if (!item) {
                res.status(404).send("Reserva não encontrada.");
            }
            else {
                generatePDF(item.reserva).then((pdf) => {
                    res.setHeader("Content-Type", "application/pdf");
                    res.status(200).send(pdf);
                });
            }
        }
    }
    catch (err) {
        next(err);
    }
}));
export default router;
