

const { Router } = require('express');
const { check } = require('express-validator');
const router = Router();
const { crearUsuario, loginUsuario, revalidarToken } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
//router registro usuario POST
router.post(
    '/new',
    [
        //middleware validaciones here
        check('name','El nombre es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        check('password','El password debe de ser de 6 caracteres').isLength({min: 6}),
        validarCampos
        
    ],
     crearUsuario);

//router login usuario POST
router.post(
    '/',
    [
        check('email', 'El email es obligatorio').isEmail(),
        check('password','El password debe de ser de 6 caracteres').isLength({min: 6}),
        validarCampos
    ],
    loginUsuario);

//router revalidarTpken usuario POST
router.get('/renew', validarJWT ,revalidarToken);


 // para exportar
 module.exports = router;