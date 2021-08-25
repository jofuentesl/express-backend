/*
api/usuarios
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { getUsuarios, 
        createUsuario, 
        updateUsuario,
        deleteUsuario
        } = require('../controllers/usuarios');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

//obtener usuarios
router.get('/', validarJWT, getUsuarios);

//crear usuarios
router.post('/', 
    [
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('password', 'El password es obligatorio').not().isEmpty(),
        check('email', 'El email no es válido').isEmail(),
        validarCampos
    ],
    createUsuario
);

//actualizar usuario
router.put('/:id',
    [   
        validarJWT,
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'El email no es válido').isEmail(),
        check('role', 'El role es obligatorio').not().isEmpty(),
        validarCampos,
         
    ],
    updateUsuario
);

router.delete('/:id',
    validarJWT,
    deleteUsuario
);
module.exports = router;
