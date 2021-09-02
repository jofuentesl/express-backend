const { response } = require('express');
const bcryptjs = require('bcryptjs');
const Usuario = require('../models/usuario');
const generarJWT = require('../helpers/jwt');
const { googleVerify } = require('../helpers/google-verify');


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

const loginGoogle = async (req, res = response) => {

    const googleToken = req.body.token;

    try {

        const { name, email, picture } = await googleVerify( googleToken ); 
        
        
        const usuarioDB = await Usuario.findOne({ email });
        
        //verificar si existe usuarios con ese correo
        let usuario;
        if( !usuarioDB ) {
            usuario = new Usuario({
                nombre: name,
                email,
                password:'@@@',
                img: picture,
                google: true
            });
        } else {
            //existe usuario
            usuario = usuarioDB;
            usuario.google = true;
        }

        //guardar en DB
        await usuario.save();

        //generar TOKEN
        const token =  await generarJWT( usuario.id );

        res.json({
            ok: true,
            msg: "Google sign-in ok",
            token
        });
        
    } catch (error) {
     
        res.status(401).json({
            ok: false,
            msg: "Token no válido",
        });
    }
}

module.exports = {
    login,
    loginGoogle
};