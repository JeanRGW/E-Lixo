import * as Models from "./models.js";
import PDF from 'pdfkit';
import QRCode from 'qrcode';

async function limparReservas(){
    let dataMax = new Date();
    dataMax.setDate(dataMax.getDate() - 7)

    await Models.Item.updateMany(
        {"reserva.reservaId": {$ne: null}, "reserva.data": {$lt: dataMax}},
        {$set: {"reserva.nome": null, "reserva.data": null, "reserva.reservaId": null}})

    console.log("Reservas limpas")
}

function generatePDF(reserva){
    return new Promise((resolve, reject) => {
        try {
            const docWidth = 220
            const qrWidth = 200

            const doc = new PDF({
                size: [docWidth, 260],
                margin: 10
            });

            const qrText = `${process.env.URL}/entregue?reservaId=${reserva.reservaId}`;

            const buffers = [];
            doc.on('data', buffer => buffers.push(buffer));
            doc.on('end', () => resolve(Buffer.concat(buffers)));
            
            QRCode.toBuffer(qrText).then(qrData => {               
                doc.image(qrData, (docWidth - qrWidth)/2, doc.y, {width: qrWidth})
                
                doc.font('Helvetica').fontSize(14).text(`Nome:${reserva.nome}`, {align: 'center'}); // Replace 'Your Name' with the actual name`

                const dataMax = new Date(reserva.data)
                dataMax.setDate(dataMax.getDate() + 7);
                doc.font('Helvetica').fontSize(14).text("Val: " + dataMax.toLocaleDateString(), {align: 'center'}); // Date
                
                doc.end();
            });
        } catch (err) {
            reject(err);
        }
    })
}

export {limparReservas, generatePDF};