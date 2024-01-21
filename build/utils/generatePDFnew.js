var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import PDF from "pdfkit";
import QRCode from "qrcode";
function generateQRCode(reservaId) {
    return __awaiter(this, void 0, void 0, function* () {
        const qrText = `${process.env.URL}/entregue?reservaId=${reservaId}`;
        return yield QRCode.toBuffer(qrText);
    });
}
function generatePDF(reserva) {
    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
        try {
            const docWidth = 220;
            const qrWidth = 200;
            const doc = new PDF({
                size: [docWidth, 260],
                margin: 10,
            });
            const buffers = [];
            doc.on("data", (buffer) => buffers.push(buffer));
            doc.once("end", () => {
                resolve(Buffer.concat(buffers));
            });
            const qrData = yield generateQRCode(reserva.reservaId);
            doc.image(qrData, (docWidth - qrWidth) / 2, doc.y, { width: qrWidth });
            doc.font("Helvetica").fontSize(14).text(`Nome:${reserva.nome}`, { align: "center" });
            const dataMax = new Date(reserva.data);
            dataMax.setDate(dataMax.getDate() + 7);
            doc
                .font("Helvetica")
                .fontSize(14)
                .text("Val: " + dataMax.toLocaleDateString(), { align: "center" });
            doc.end();
        }
        catch (err) {
            reject(new Error(`Error generating PDF: ${err}`));
        }
    }));
}
export default generatePDF;
