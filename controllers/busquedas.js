const { response } = require('express');
const Usuario = require('../models/usuario');
const Medico = require('../models/medico');
const Hospital = require('../models/hospital');

const getTodo = async (req, res=response) => {

    const todo = req.params.busqueda;
    const regex = new RegExp(todo, 'i');

    /*const searchUser = await Usuario.find({nombre: regex});
    const searchDoctor = await Medico.find({nombre: regex});
    const searchHospital = await Hospital.find({nombre: regex});*/
    
    const [ user, doctor, hospital]= await Promise.all([

        Usuario.find({nombre: regex}),
        Medico.find({nombre: regex}),
        Hospital.find({nombre: regex})
    ]);

    res.status(200).json({
        ok: true,
        user,
        doctor,
        hospital
    });
}

const getColeccion = async (req, res=response) => {

    const tabla = req.params.tabla;
    const todo = req.params.busqueda;
    const regex = new RegExp(todo, 'i');

    let data = [];

    switch (tabla) {
        case 'medicos':
            data = await Medico.find({nombre: regex})
                                .populate('usuario', 'nombre img')
                                .populate('hospital', 'nombre img');
            break;
        case 'hospitales':
            data = await Hospital.find({nombre: regex})
                                .populate('usuario', 'nombre img');
            break;    
        case 'usuarios':
            data = await Usuario.find({nombre: regex});

            break;
        default:
            return res.status(400).json({
                ok: false,
                msg: "La tabla tiene que ser medicos,hospitales o usuarios"
            });
    
        }

        res.json({
            ok: true,
            resultados: data
        });
}

module.exports = {
    getTodo,
    getColeccion
}