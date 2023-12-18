const crypto = require('crypto');

async function checkAdmin(mongoose, data){
    if(!data.authKey){ return false }

    Admin = mongoose.model("Admin");

    admin = await Admin.findOne({"authKey": data.authKey})

    if(!admin){
        console.log("Admin doesnt exists");
        return false
    } else {
        console.log("Admin found")
        return true
    }
}

async function limparReservas(mongoose){
    var dataMax = new Date();
    dataMax.setDate(dataMax.getDate() - 7)

    Item = mongoose.model("Item");
    await Item.updateMany({"reserva.data": {$lt: dataMax}}, {$set: {"reserva.nome": null, "reserva.data": null}})

    console.log("Reservas limpas")
}

function generateToken(){
    return crypto.randomBytes(30).toString('hex');
}

module.exports = {checkAdmin, limparReservas, generateToken}