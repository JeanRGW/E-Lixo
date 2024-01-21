import mongoose from "../config/mongooseConn.js";
const AdminScheema = new mongoose.Schema({
    nome: {
        type: String,
        required: true,
    },
    user: {
        type: String,
        required: true,
    },
    pass: {
        type: String,
        required: true,
    },
});
const Admin = mongoose.model("Admin", AdminScheema);
export default Admin;
