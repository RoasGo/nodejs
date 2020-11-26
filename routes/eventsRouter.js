const { Router } = require('express');
const { check } = require('express-validator');
const { obtenerEventos, crearEvento, actualizarEvento, eliminarEvento } = require('../controllers/eventController');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();
router.use( validarJWT );

router.get( 
    '/',
    obtenerEventos 
);

router.post( 
    '/',
    [
        check( 'title', 'Titulo es obligatorio' ).not().isEmpty(),
        check( 'start', 'Ingrese una fecha de inicio válida' ).isDate(),
        check( 'end', 'Ingrese una fecha de fin válida' ).isDate(),
        validarCampos
    ],
    crearEvento 
);

router.put( 
    '/:uid', 
    actualizarEvento 
);

router.delete( 
    '/:uid', 
    eliminarEvento 
);


module.exports = router;