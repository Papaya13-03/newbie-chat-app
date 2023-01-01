const mongoose = require('mongoose');
const conn = mongoose.createConnection("mongodb://localhost:27017/accounts")
const AccountSchema = new mongoose.Schema({
    username:String,
    password:String,
    nickname:String
});

const AccountModel = conn.model('accounts', AccountSchema);

module.exports = AccountModel;


