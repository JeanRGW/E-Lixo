const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const Models = require("./models");
const {checkAdmin, limparReservas, generateToken} = require("./functions.js");
require('dotenv').config();

// Express
const app = express();
const port = 3000;
app.use(express.json());
app.use(express.static('public'));
app.use(cors())

// Mongo
mongoose.connect(process.env.MONGODB_URI);
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB!');
});

limparReservas(mongoose);

// Rotas
// 
app.get('/lista', async (req, res, next) => {
    try {
        lista = await Models.Item.find({'reserva.nome': null}, {reserva: 0});
        res.json(lista);
    } catch (err) {
        next(err)
    }
})

// authkey
app.post('/listaAdmin', async (req, res, next) => {
    try{
        data = req.body

        checkAdmin(mongoose, data).then((adminAuth) => {
            if(!adminAuth){
                res.status(403).send("Sem autorização");
            }

            lista = Models.Item.find({"reserva.nome": {$ne: null}}).then((lista) => {
                res.status(200).send(lista);
            })
        })
    } catch (err) {
        next(err)
    }
})

// authKey, categoria, tipo, modelo ? qty
app.post('/register', async (req, res, next) => {
    try {
        data = req.body;

        checkAdmin(mongoose, data).then(adminAuth => {
            if(!adminAuth){
                res.clearCookie('authKey');
                res.status(403).send('Invalid Auth Key');
                return;
            }

            delete data.authKey;

            var newItem = new Models.Item({...data});
            console.log(newItem);
            newItem.save();

            res.status(200).send('Objeto inserido com sucesso!');
        })
    } catch (err) {
        next(err)
    }   
})

// nome, objectId
app.post('/reservar', (req, res, next) => {
    try {
        data = req.body;
        if(!data.nome || !data.objectId){
            res.status(403).send('Invadid Reservation');
            return;
        }

        Models.Item.findOne({_id: data.objectId}).then((item) => {
            if(!item){
                res.status(404).send('Item não encontrado');
                return;
            }
            if(item.reserva.nome != null){
                res.status(403).send('Item já reservado');
                return;
            }

            item.mkReserva(data.nome)
            item.save();

            res.status(200).send('Item reservado com sucesso!');
            return;
        })
    } catch (err) {
        next(err)
    }
})

// authKey
app.post("/reservas", async (req, res, next) => {
    try {
        data = req.body;

        checkAdmin(mongoose, data).then(async (adminAuth) => {
            if(!adminAuth){
                res.clearCookie('authKey');
                res.status(403).send('Invalid Auth Key');
                return;
            }

            lista = lista = await Item.find({'reserva.nome': {$ne: null}});

            console.log(lista);

            res.json(lista);
        })
    } catch (err) {
        next(err);
    }
})

// user, pass
app.post("/login", async (req, res, next) => {
    try {
        data = req.body;

        if(data.user && data.pass){
            admin = await Models.Admin.findOne({'user': data.user, 'pass': data.pass});
            
            if(admin){
                admin.authKey = generateToken();
                admin.save();

                res.status(200).cookie("authKey", admin.authKey, {maxAge: 604800000, httpOnly: true}).send("Autenticado com sucesso!");
            } else {
                res.status(403).send("Credenciais incorretas!");
            }
        } else {
            res.status(400).send("Insira usuário e senha.");
        }
    } catch (err) {
        next(err);
    }  
})

// Error Handling
app.use((err, req, res, next) => {
    console.error("Error:", err);
    res.status(500).send("Internal Server Error");
})

app.listen(port, () => {
    console.log(`App ouvindo a porta ${port}`);
})