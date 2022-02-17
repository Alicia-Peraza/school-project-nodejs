const mongoose = require('mongoose')
const Schema = mongoose.Schema
const CurpSchema = Schema ({
    nombre: String,
    paterno: String,
    materno: String,
    birthday: String,
    gender: String,
    estado: String,
    curp: String
})

module.exports = mongoose.model('Curp', CurpSchema)