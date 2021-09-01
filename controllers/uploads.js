const path = require('path');
const fs = require('fs');

const { response } = require("express")
const { v4: uuidv4 } = require('uuid');
const { actualizarImagen } = require('../helpers/actualizarImg');

const fileUpload = (req, res = response) => {

    const tipo  = req.params.tipo;
    const id    = req.params.id;

    //validar tipo
    const tiposValidos = ['hospitales', 'medicos', 'usuarios'];

    if( !tiposValidos.includes(tipo) ) {
        return res.status(400).json({
            ok:false,
            msg: 'El tipo no es válido'
        });
    }
    //validar que hay archivo
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok:false,
            msg: "No hay archivo"
        });
      }
    //procesar img...

    const img = req.files.imagen;
    
    const nombreCortado = img.name.split('.');
    const extensionArchivo = nombreCortado[ nombreCortado.length -1];
    
    //validar extensión

    const extensionesValidas = ['png', 'jpg', 'jpeg', 'gif'];
    if( !extensionesValidas.includes( extensionArchivo ) ) {
        return res.status(404).json({
            ok: false,
            msg: 'Extensión de imagen no válida'
        });
    }

    //Generar nombre archivo
    const nombreArchivo = `${ uuidv4() }.${ extensionArchivo }`;

    //Path para guardar la imagen
    const path = `./uploads/${tipo}/${nombreArchivo}`;

    // Use the mv() method to place the file somewhere on your server
    img.mv(path, (err)=> {
        if (err) {
            console.log(err)
            return res.status(500).json({
                ok: false,
                msg: 'error al mover a imagen'
            });
        }

        //actualizar bbdd
        actualizarImagen( tipo, id, nombreArchivo);    

        res.json({
            ok: true,
            nombreArchivo,
            msg:'archivo subido'
        });
    });
}

const retornaImg = ( req, res= response) => {
    const tipo  = req.params.tipo;
    const foto  = req.params.foto;

    const pathImg = path.join( __dirname, `../uploads/${ tipo }/${ foto }` );

    //img por defecto
    if( fs.existsSync( pathImg )) {
        res.sendFile( pathImg );
    } else {
        const pathImg = path.join( __dirname, `../uploads/No-image-available.png` );
        res.sendFile( pathImg );
    }
    
} 

module.exports =  {
    fileUpload,
    retornaImg
}
