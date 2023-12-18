const now = new Date();
console.log(now)

let passado = new Date();
passado.setDate(passado.getDate() - 7)
console.log(passado)






const newItem = new Item({
    item: {
        categoria: "componente",
        tipo: "processador",
    }
})

newItem.mkReserva("JeanRGW")

for(var i=0; i<999999999; i++){

}

console.log(Date.now() - newItem.reserva.data)

newItem.save().then(savedItem => {
    console.log('Item saved:', savedItem);
  }).catch(err => {
    console.error('Error saving item:', err);
});



try {
    Models.Admin.findOne({"user": "JeanRGW"}).then(admin => {
        console.log(admin)
    })
} catch (err) {
    console.log(err)
}



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

mongoose.connect("mongodb+srv://Backend:kauTmiejVF7r7JA5@cluster0.kpn1j9s.mongodb.net/?retryWrites=true&w=majority");
const db = mongoose.connection;

const jean = new Admin({
    nome: "Jean Rafael G. Wojcik",
    user: "JeanRGW",
    pass: "99626523"
})

jean.save().catch(err => {
    console.log("Error saving item:", err)
});