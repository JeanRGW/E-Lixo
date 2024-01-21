var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Item } from "../models/models.js";
import cron from "node-cron";
function limparReservas() {
    return __awaiter(this, void 0, void 0, function* () {
        let dataMax = new Date();
        dataMax.setDate(dataMax.getDate() - 7);
        yield Item.updateMany({ "reserva.reservaId": { $ne: null }, "reserva.data": { $lt: dataMax } }, { $set: { "reserva.nome": null, "reserva.data": null, "reserva.reservaId": null } });
        console.log("Reservas limpas");
    });
}
cron.schedule("0 0 0 * * *", () => {
    limparReservas();
});
limparReservas();
export default limparReservas;
