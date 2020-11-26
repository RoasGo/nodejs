/**
 * RUTAS PARA LOS EVENTOS 
 * /api/events
 */
const Evento = require('../models/Evento');
const jwt = require('jsonwebtoken');

const obtenerEventos = async ( req, res ) => {

    const eventos = await Evento.find().populate( 'user', 'name' );

    res.json({
        ok: true,
        eventos
    });

}

const crearEvento = async ( req, res ) => {

    const evento = new Evento( req.body );

    try {

        evento.user = req.uid;
        
        const eventoGuardado = await evento.save();

        res.status( 201 ).json({
            ok: true,
            evento: eventoGuardado
        });

    } catch (error) {
        console.log( error );
        return res.status( 500 ).json({
            ok: false,
            msg: 'Contacte al admin'
        })
    }

}

const actualizarEvento = async ( req, res ) => {

    const { uid } = req.params;
    const usuarioID = req.uid;

    try {
        
        const evento = await Evento.findById( uid );
        if ( !evento ) {
            return res.status( 404 ).json({
                ok: false,
                msg: 'No existe evento con ese ID'
            })
        }

        if ( evento.user.toString() !== usuarioID ) {
            return res.status( 401 ).json({
                ok: false,
                msg: 'No tiene privilegios de editar este evento'
            })
        }

        const nuevoEvento = {
            ...req.body,
            user: usuarioID
        }

        const eventoActualizado = await Evento.findByIdAndUpdate( uid, nuevoEvento, { new: true } );

        res.status( 200 ).json({
            ok: true,
            evento: eventoActualizado
        });

    } catch (error) {
        console.log(error);
        return res.status( 500 ).json({
            ok: false,
            msg: 'Error en el servidor'
        })
    }

}

const eliminarEvento = async ( req, res ) => {

    const { uid } = req.params;
    const usuarioID = req.uid;

    try {
        
        const evento = await Evento.findById( uid );
        if ( evento.user.toString() !== usuarioID ) {
            return res.status( 401 ).json({
                ok: false,
                msg: 'No tiene privilegios para eliminar este evento'
            })
        }

        await Evento.findByIdAndRemove( uid );

        res.status( 200 ).json({
            ok: true,
            msg: 'Evento eliminado satisfactoriamente'
        })

    } catch (error) {
        console.log(error);
        return res.status( 500 ).json({
            ok: false,
            msg: 'Error en el servidor'
        })
    }

}

module.exports = {
    obtenerEventos,
    crearEvento,
    actualizarEvento,
    eliminarEvento
}