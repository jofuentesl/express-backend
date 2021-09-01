/*
'/api/medicos'
*/
const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { getMedicos, 
        createMedico, 
        updateMedico, 
        deleteMedico } = require('../controllers/medicos');

const router = Router();

//obtener medicos
router.get('/', getMedicos);

//crear medico
router.post('/', 
    [
        validarJWT,
        check('nombre', "El nombre es obligatorio").notEmpty(),
        check('hospital', "El id del hospital debe ser validos").isMongoId(),
        validarCampos
    ],
    createMedico
);

//actualizar medico
router.put('/:id',
    [   
         
    ],
    updateMedico
);

//borrar medico∫
router.delete('/:id',
    deleteMedico
);

module.exports = router;