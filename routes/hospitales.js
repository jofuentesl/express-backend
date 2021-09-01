/*
'/api/hospitales'
*/
const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { getHospitales, 
        createHospital, 
        updateHospital, 
        deleteHospital } = require('../controllers/hospitales');

const router = Router();

//obtener hospitales
router.get('/', getHospitales);

//crear hospital
router.post('/', 
    [
        validarJWT,
        check('nombre', 'El nombre del hospital es obligatorio').notEmpty(),
        validarCampos
    ],
    createHospital
);

//actualizar hospital
router.put('/:id',
    [   
         
    ],
    updateHospital
);

router.delete('/:id',
    deleteHospital
);

module.exports = router;