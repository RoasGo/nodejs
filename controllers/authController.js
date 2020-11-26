const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');

const crearUsuario = async ( req, res ) => {
    
    const { email, password } = req.body;
    try {

        let usuario = await Usuario.findOne({ email });

        if ( usuario ) {
            return res.status( 400 ).json({
                ok: false,
                msg: 'Ya existe un usuario con ese correo'
            })
        }

        usuario = new Usuario( req.body );

        //encriptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync( password, salt );

        await usuario.save();

        //Generar JWT
        const token = await generarJWT( usuario.id, usuario.name );

        res.status( 201 ).json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        });

    } catch (error) {
        console.log(error);
        res.status( 500 ).json({
            ok: false,
            msg: 'Comunicarse con el admin'
        })
    }
}

const logUsuario = async (req, res ) => {
    
    const { email, password } = req.body;

    try {

        const usuario = await Usuario.findOne({ email });
        if ( !usuario ) {
            return res.status( 400 ).json({
                ok: false,
                msg: 'No existe el usuario con ese email'
            });
        }

        //confirmar los passwords
        const validPassword = bcrypt.compareSync( password, usuario.password );
        if ( !validPassword ) {
            return res.status( 400 ).json({
                ok: false,
                msg: 'Password incorrecto',
            })
        }

        //Generar el JWT
        const token = await generarJWT( usuario.id, usuario.name );

        res.status( 200 ).json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        });

    } catch (error) {
        console.log(error);
        res.status( 500 ).json({
            ok: false,
            msg: 'Comunicarse con el admin'
        })
    }

}

const renovarToken = async ( req, res ) => {

    const { uid, name } = req;

    //Generar nuevo token
    const token = await generarJWT( uid, name );

    res.status( 201 ).json({
        ok: true,
        token
    });
}


module.exports = {
    crearUsuario,
    renovarToken,
    logUsuario,
}