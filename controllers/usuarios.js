const { response } = require('express');
const bcryptjs = require('bcryptjs');
const Usuario = require('../models/usuario');
const generarJWT = require('../helpers/jwt');

const getUsuarios = async (req, res) => {

    const usuarios = await Usuario.find({}, "nombre email google role");
    res.json(
        {
            ok: true,
            usuarios
        }
    );
}

const createUsuario =  async (req, res = response) => {

    const { email, password } = req.body;

    try {

        const existeEmail = await Usuario.findOne({ email });

        if(existeEmail) {
            return res.status(500).json({
                ok: false,
                msg: "El correo ya existe"
            });
        }

        const usuario = new Usuario(req.body);

        //encriptar contraseña
        const salt = bcryptjs.genSaltSync();
        usuario.password = bcryptjs.hashSync( password, salt );

        //guardamos usuario bbdd
        await usuario.save();

        //generar TOKEN
        const token =  await generarJWT( usuario.id );

        res.json(
            {
                ok: true,
                usuario,
                token
            }
        );
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "Error interno revisar logs"
        })
    }
}
const updateUsuario = async (req, res = response)=> {

    const uid = req.params.id;
    
    try {

        const existeUsuario = await Usuario.findById(uid);

        if(!existeUsuario) {
            
            return res.status(404).json({
                ok: false,
                msg: "El usuario no existe"
            });
        }

        //actualizar campos
        const {password, google, email, ...campos} = req.body;

        if( existeUsuario.email !== email ) {
    
            const existeEmail = await Usuario.findOne( {email});
            
            if( existeEmail ) {
                return res.status(400).json({
                    ok:false,
                    msg: "Existe usuario con este email"
                })
            }
        }

        campos.email = email;

        const usuariosActualizado = await Usuario.findByIdAndUpdate(uid, campos, { new:true });

        res.json({
            ok: true,
            usuaio: usuariosActualizado
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg:"error actualizar usuario"
        });   
    }
}

const deleteUsuario = async (req, res = response)=> {

    const uid = req.params.id;

    try {

        const existeUsuario = await Usuario.findById(uid);

        if(!existeUsuario) {
            
            return res.status(404).json({
                ok: false,
                msg: "El usuario no existe"
            });
        }

        await Usuario.findByIdAndDelete( uid );

        res.status(200).json({
            ok: true,
            msg:"Usuario eliminado"
        });
        
    } catch (error) {
        console.log(error);

        res.status(500).json({
            ok:false,
            msg: "Error al borrar usuario"
        });
        
    }
}

module.exports = {
    getUsuarios,
    createUsuario,
    updateUsuario,
    deleteUsuario
}