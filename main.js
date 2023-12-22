import mongoose from "mongoose";
import express from "express";
import cors from "cors";
import * as Models from "./models.js"; // Assuming ./models.js exports multiple items as named exports
import { limparReservas, generatePDF } from "./functions.js";
import { checkAdmin, generateToken } from "./auth.js"

import dotenv from 'dotenv';
dotenv.config();

// Express
const app = express();
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

limparReservas();

// Rotas
// 
app.get('/lista', async (req, res, next) => {
    try {
        const lista = await Models.Item.find({'reserva.reservaId': null}, {reserva: 0});
        res.json(lista);
    } catch (err) {
        next(err)
    }
})

// authkey
app.post('/listaAdmin', async (req, res, next) => {
    try{
        const data = req.body

        if(await checkAdmin(data)){
            const lista = await Models.Item.find({"reserva.nome": {$ne: null}})
            res.status(200).send(lista);
        } else {
            res.status(403).send("Sem autorização");
        }
    } catch (err) {
        next(err)
    }
})

// authKey, categoria, tipo, modelo ? qty
app.post('/register', async (req, res, next) => {
    try {
        let data = req.body;

        if(await checkAdmin(data)){
            const qty = data.qty || 1;

            delete data.authKey;
            delete data.qty

            for(let i=0; i<qty; i++){
                const newItem = new Models.Item({...data});
                newItem.save();
            }
            
            res.status(200).send('Objeto inserido com sucesso!');
        } else {
            res.clearCookie('authKey');
            res.status(403).send('Invalid Auth Key');
            return;
        }
    } catch (err) {
        next(err)
    }   
})

// nome, objectId
app.post('/reservar', async (req, res, next) => {
    try {
        const {nome, objectId} = req.body;

        if(!nome || !objectId){
            res.status(403).send('Invadid Reservation');
            return;
        }

        let item = await Models.Item.findOne({'_id': objectId})

        if(!item){
            res.status(404).send('Item não encontrado');
            return;
        }

        if(item.reserva.nome != null){
            res.status(403).send('Item já reservado');
            return;
        }

        item.mkReserva(nome)
        item.save();

        res.status(200).send('Item reservado com sucesso!');
        return;

    } catch (err) {
        next(err)
    }
})

// reservaId
app.get('/reserva', async (req, res, next) => {
    try {
        const { reservaId } = req.query;
        if(!reservaId){
            res.status(404).send("Reserva não encontrada.");
        } else {
            const item = await Models.Item.findOne({"reserva.reservaId": reservaId})
            if(!item){
                res.status(404).send("Reserva não encontrada.");
            } else {
                generatePDF(item.reserva).then((pdf) => {
                    res.setHeader('Content-Type', 'application/pdf');
                    res.status(200).send(pdf);
                })
            }
        }
    } catch (err) {
        next(err);
    }
})

// authKey
app.post("/reservas", async (req, res, next) => {
    try {
        const data = req.body;

        checkAdmin(data).then(async (adminAuth) => {
            if(!adminAuth){
                res.clearCookie('authKey');
                res.status(403).send('Invalid Auth Key');
                return;
            }

            const lista = await Models.Item.find({'reserva.nome': {$ne: null}});
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

// reservaId // GET não é exatamente o adequado, mas foi usado por comodidade
app.get("/entregue", async (req, res, next) => {
    try {
        if(req.query.reservaId){
            const reservaId = req.query.reservaId
            const item = await Models.Item.findOne({"reserva.reservaId": reservaId})

            if(item){
                await Models.Item.findOneAndDelete({"reserva.reservaId": reservaId})
                res.status(200).send("Objeto entregue e removido com sucesso!")
            } else {
                res.status(400).send("Reserva não encontrada, não existe ou já foi entregue")
            }
            
        } else {
            res.status(400).send("Fornecer reservaId como parâmetro")
        }
    } catch (err) {
        next(err)
    }
})

// Error Handling
app.use((err, req, res, next) => {
    console.error("Error:", err);
    res.status(500).send("Internal Server Error");
})

app.listen(process.env.PORT, () => {
    console.log(`App ouvindo a porta ${process.env.PORT}`);
})