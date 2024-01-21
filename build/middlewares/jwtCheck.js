import jwt from "jsonwebtoken";
const SECRET = process.env.SECRET || "Development";
const jwtCheck = (req, res, next) => {
    var _a, _b, _c;
    try {
        const token = ((_a = req.cookies) === null || _a === void 0 ? void 0 : _a.token) || ((_b = req.body) === null || _b === void 0 ? void 0 : _b.token) || ((_c = req.query) === null || _c === void 0 ? void 0 : _c.token) || null;
        req.decodedToken = jwt.verify(token, SECRET);
        next();
    }
    catch (err) {
        console.log(err);
        return res.clearCookie("token").redirect("/login");
    }
};
export default jwtCheck;
