import PDF from "pdfkit";
import QRCode from "qrcode";
function generatePDF(reserva) {
    return new Promise((resolve, reject) => {
        try {
            const docWidth = 220;
            const qrWidth = 200;
            const doc = new PDF({
                size: [docWidth, 260],
                margin: 10,
            });
            const qrText = `${process.env.URL}/entregue?reservaId=${reserva.reservaId}`;
            const buffers = [];
            doc.on("data", (buffer) => buffers.push(buffer));
            doc.on("end", () => resolve(Buffer.concat(buffers)));
            QRCode.toBuffer(qrText).then((qrData) => {
                doc.image(qrData, (docWidth - qrWidth) / 2, doc.y, { width: qrWidth });
                doc.font("Helvetica").fontSize(14).text(`Nome:${reserva.nome}`, { align: "center" });
                const dataMax = new Date(reserva.data);
                dataMax.setDate(dataMax.getDate() + 7);
                doc
                    .font("Helvetica")
                    .fontSize(14)
                    .text("Val: " + dataMax.toLocaleDateString(), { align: "center" });
                doc.end();
            });
        }
        catch (err) {
            reject(err);
        }
    });
}
export default generatePDF;
