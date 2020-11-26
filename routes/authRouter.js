/*
    Rutas de Usuarios / Auth
    host + /api/auth
*/

const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { crearUsuario, renovarToken, logUsuario } = require('../controllers/authController');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();


router.post( 
    '/new', 
    [
        check( 'name', 'El nombre no debe estar vacío' ).notEmpty(),
        check( 'email', 'Debe ingresar un correo válido' ).isEmail(),
        check( 'password', 'El password debe de ser de 6 caracteres' ).isLength({ min: 6 }),
        validarCampos
    ],
    crearUsuario 
);

router.post( 
    '/', 
    [
        check( 'email', 'Debe ingresar un correo válido' ).isEmail(),
        check( 'password', 'El password debe de ser de 6 caracteres' ).isLength({ min: 6 }),
        validarCampos
    ],
    logUsuario 
);

router.get( 
    '/renew', 
    validarJWT,
    renovarToken 
);


module.exports = router;