const { response } = require('express');
const Medico = require('../models/medico');


const getMedicos = async (req, res = response)=> {

    const medicos = await Medico.find().populate('usuario', 'nombre img')
                                        .populate('hospital', 'nombre img');
    res.json({
        ok: true,
        medicos
    });
}

const createMedico = async (req, res = response)=> {

    const uid = req.uid;
    const newMedico = new Medico({
        usuario: uid,
        hospital: "60e81ed97aeafc1fec437c4d",
        ...req.body
    });
    console.log("test",  newMedico);
    
    try {

        const medicoDB = await newMedico.save();

        res.json({
            ok: true,
            medico: medicoDB
        });
        
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: "error inesperado"
        });
        
    }
}

const updateMedico = (req, res = response)=> {
    res.json({
        ok: true,
        msg: "updateMedico"
    });
}

const deleteMedico = (req, res = response)=> {
    res.json({
        ok: true,
        msg: "deleteMedico"
    });
}

module.exports = {
    getMedicos,
    createMedico,
    updateMedico,
    deleteMedico
}