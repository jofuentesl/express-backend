const { response } = require('express');
const bcryptjs = require('bcryptjs');
const Usuario = require('../models/usuario');
const generarJWT = require('../helpers/jwt');

const login = async (req, res = response )=> {

    const {password, email} = req.body;

    try {

        const usuarioDB = await Usuario.findOne({email});

        if(!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: "Email no valido"
            });
        }
        //verificar contraseña
        const validPassword = bcryptjs.compareSync(password, usuarioDB.password);
        if( !validPassword ) {
            return res.status(404).json({
                ok: false,
                msg: "password no valido"
            });
        }
        
        //generar TOKEN
        const token =  await generarJWT( usuarioDB.id );
        res.status(200).json({
            ok: true,
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg:"error login usuario"
        });
        
    }
}

module.exports = {
    login
};