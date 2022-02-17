const express = require ('express');
const expressLayout = require('express-ejs-layouts');
const bodyParser = require ('body-parser');
const app = express();
//const port = process.env.port || 3000;//inicializamos las dependencias
const mongoose = require('mongoose')//load MONGO module
const config = require('./config')//set the conection and the port for the DB
const Curp = require('./models/curp')


app.set('view engine', 'ejs');
app.use(expressLayout);//se establece el motor de vistar con ejs
app.use(bodyParser.urlencoded({extended:true}));//uso de body parser para request.body

app.use(express.static(__dirname +'/public'));//set static files (css, pdf, image) location

app.get('/', (req, res)=>{
    res.render('pages/home');
});

app.get('/contacto', (req, res ) =>{
    res.render('pages/contacto');
});

app.post('/contacto', (req, res ) =>{
    var email = req.body.email;
    var name = req.body.nombre;


    res.render('pages/msg2',{ email, name});
});


app.get('/curp', (req, res)=>{
    res.render('pages/curp');
});

app.post('/curp', (req, res)=>{
   
    let str =  (req.body.paterno).substring(0,2).toUpperCase();
    var str2 = (req.body.materno).substring(0,1).toUpperCase();;
    var str1 = (req.body.nombre).substring(0,1).toUpperCase();;
    var str3 = (req.body.anio).substring(2,4);
    var str4 = req.body.mes;
    var str5 = req.body.dia;
    var str6 = req.body.gender;
    var str7 = req.body.estado;
    var pname = (req.body.paterno).toUpperCase();
    var mname = (req.body.materno).toUpperCase(); 
    var name = (req.body.nombre).toUpperCase();
    var str8 = consonte(pname);
    var str9 = consonte(mname);
    var str10 = consonte(name);
    var cadena = makeid(2);


    var curp = str + str2 + str1 + str3 + str4
    + str5 + str6 + str7 + str8 + str9 + str10
    + cadena;//creamos la cupr

    //guardamos el schema en la bd
    let homoC = new Curp()
    homoC.nombre = req.body.nombre
    homoC.paterno = req.body.paterno
    homoC.materno = req.body.materno
    homoC.birthday = str4 + '/' + str5 + '/' + req.body.anio
    homoC.gender = req.body.gender
    homoC.estado = req.body.estado
    homoC.curp = curp

    homoC.save((err, curpStored) =>{
        if(err) res.status(500).send({message:`Error al savar en DB ${err}`})

        res.render('pages/msg', {curp, name})
    })

    
});

function consonte(name){
    const conso = ['B', 'C','D','F', 'G','H','J','K','L','M','N','Ñ',
    'P','Q','R','S','T','V','W','X','Y','Z'];
    var separador = ""; // un espacio en blanco, null
    var limite = name.length;
    arregloName = name.split(separador, limite);//porque se va a dividir, que tanto se divide
    let posicion;
    var v = 0;

    for(var i=0;i<arregloName.length;i++){

	for(var j=0;j<conso.length;j++)
	{
        if( (arregloName[i]==conso[j])  && (i >= 1) )
        
        
        return arregloName[i];
        v=1;
			
    }

}    
};


function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
 };

/*app.listen(port,() => {
    console.log('servidor iniciado')
 });*/

 app.get('/all',(req, res) =>{//buscar todas las curp
    Curp.find( { } ,( err, all ) => {
    
    if(err) return res.status(500).send({message: `Error al realizar la peticion${err}` })
    if(!(all && all.length)) return res.status(404).send({message:`No existen curps registradas`})
    //res.status(200).send( {products:[products]})
    res.render('pages/all',{all})
    })
    })


 app.get('/perazaAlicia361/buscar',(req,res)=>{//busca una curp
        let curpU = req.query.busca
        //Product.findById(productId,(err,products) =>{
        Curp.find({curp : curpU},(err,all)=>{ 
            if(err) return res.status(500).send({message:`Error al realizar la peticion${err}`})

            if (!(Array.isArray(all) && all.length)) {
                //return res.status(404).send({message:`El producto no existe`})
                res.render('pages/notFound')
            }

            res.render('pages/curpFound',{curp: all})
    
        })
    })





 mongoose.connect(config.db,config.urlParser, (err, req)=>{//conexion a la BD

    if(err){
        return console.log(`error al concectar DB ${err}`)
    }

    console.log(`Conexion exitosa`)

    app.listen(config.port, () => {
    console.log(`API-REST ejecutando http://localhost:${config.port} `)})

})