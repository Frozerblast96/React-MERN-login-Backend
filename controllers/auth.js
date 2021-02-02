const {response} = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/Usuario');
const {generarJWT} = require('../helpers/jwt');


const crearUsuario = async(req, res = response) => {
    //console.log(req.body)
    
    //const {name,email,password} = req.body;
    const {email, password} = req.body;
     
    try {
        //validacion de email y let para renombrar la variable
        let usuario = await Usuario.findOne({ email });
        if(usuario){
            return res.status(400).json(
                {
                    ok: false,
                    msg:"Un usuario existe con ese email"
                }
            );
        }
        
        usuario = new Usuario(req.body);
        //Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password ,salt);

        await usuario.save();
        //Generar JWT
        const token = await generarJWT(usuario.id, usuario.name);

        
        res.status(201).json({
            ok : true,
            uid: usuario.id,
            name: usuario.name,
            token
            /*
                msj : 'registro'
                name,
                email,
                password
            */   
        });

    } catch (error) {
        res.status(500).json({
            ok : false,
            msj : 'Por favor hable con el administrador'
       });
    }
    
}

//////
const loginUsuario =  async(req, res= response) =>{
    
    const {email,password} = req.body;

    try {
        let usuario = await Usuario.findOne({ email });
        //Si no existe el usuario
        if(!usuario){
            return res.status(400).json(
                {
                    ok: false,
                    msg:"El usuario no existe con ese email"
                }
            );
        }

        //Confirmar las passwords
        const validPassword = bcrypt.compareSync(password, usuario.password);
        if(!validPassword){
            return res.status(400).json(
                {
                    ok: false,
                    msg:"Password incorrecto"
                }
            );
        }

        //Generar nuestro JWT(Json Web Token)
        const token = await generarJWT(usuario.id, usuario.name);
        res.json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        })

    } catch (error) {
        res.status(500).json({ 
            ok : false,
            msj : 'Por favor hable con el administrador'
        })
    }
   

}

const revalidarToken = async(req, res= response) =>{
    /*
        const uid = req.uid;
        const name = req.name;
    */
    
    const {uid, name} = req;
    //generrrar un nuevo JWT y retornar en esta peticion
    const token = await generarJWT(uid, name);


    res.json({ 
        ok : true, 
        token
    })

 }




module.exports = {
    crearUsuario,
    loginUsuario,
    revalidarToken
}


    //validacion
    /*
        if(name.length < 5 ){
            return res.status(400).json(
                {
                    ok: false,
                    msj: 'El nombre debe ser de 5 letras'
                }
            );
        }
    */