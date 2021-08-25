const jwt = require('jsonwebtoken');

const validarJWT = ( req, res, next) => {

    //leer token
    const token = req.header('x-token');

    if( !token ) {
        return res.status(401).json({
            ok: false,
            msg: "Error obtener token"
        });
    }

    try {

        const { uid } = jwt.verify(token, process.env.JWT_SECRET);

        req.uid = uid;

        next();
        
    } catch (error) {
        return res.status(401).json({
            ok: false,
            msg: "token no correcto"
        });
        
    }
}

module.exports = {
    validarJWT
}