import crypto from 'crypto';
import {Admin} from './models.js'

const checkAdmin = async (data) => {
    if(!data.authKey || !await Admin.findOne({"authKey": data.authKey})){
        return false
    } else {
        return true
    }
}

const generateToken = () => {
    return crypto.randomBytes(30).toString('hex');
}

export {checkAdmin, generateToken}