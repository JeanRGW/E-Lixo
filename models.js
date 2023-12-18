const mongoose = require("mongoose")

const ItemScheema = new mongoose.Schema({
    item: {
        categoria: {
            type: String,
            required: true,
            enum: ["componente", "periferico", "computador", "outros"]
        },
        tipo: {
            type: String,
            required: true,
            enum: ["outro", "teclado", "mouse", "armazenamento", "memoria", "processador", "mobo", "fonte", "cooler", "gabinete"]
        },
        modelo: {
            type: String,
            default: "N/A"
        },
        addedAt: {
            type: Date,
            default: Date.now()
        }
    },

    reserva: {
        nome: {
            type: String,
            default: null
        },
        data: {
            type: Date,
            default: null
        }
    }
}, {strict: false})

ItemScheema.methods.mkReserva = function mkReserva(nome){
    this.reserva.nome = nome
    this.reserva.data = Date.now()
}

ItemScheema.methods.rmReserva = function rmReserva(){
    this.reserva.nome = null
    this.reserva.data = null
}

const Item = mongoose.model('Item', ItemScheema)

const AdminScheema = new mongoose.Schema({
    nome: {
        type: String,
        required: true
    },
    user: {
        type: String,
        required: true
    },
    pass: {
        type: String,
        required: true
    },
    authKey: {
        type: String,
        required: false
    }
})

const Admin = mongoose.model("Admin", AdminScheema)

module.exports = {Item, Admin}