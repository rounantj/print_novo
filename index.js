/*=================DEFAULT SETTINGS FOR MAIN CODE=======================
======================================================================*/

// VARIABLES AND DEPENDENCES
var express = require('express')
var app = express();
const handlebars = require('express-handlebars');
const bodyParser = require('body-parser')
const nodemailer = require('nodemailer');
const fs = require('fs').promises;

require('dotenv').config()
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
app.use(express.static('public'));
app.engine('handlebars', handlebars({defaultLayout:'main'}))
app.set('view engine', 'handlebars')
const cors = require('cors');
app.use(express.json())

//DATABSE SETTINGS
const mysql = require('mysql');
var conn;



/*=============================ROUTES FOR URLS==========================
======================================================================*/

//CORS
app.use((req, res, next) => {
	//Qual site tem permissão de realizar a conexão, no exemplo abaixo está o "*" indicando que qualquer site pode fazer a conexão
    res.header("Access-Control-Allow-Origin", "*");
	//Quais são os métodos que a conexão pode realizar na API
    res.header("Access-Control-Allow-Methods", 'GET,PUT,POST,DELETE');
    app.use(cors());
    next();
});

app.use((req, res, next) => { //Cria um middleware onde todas as requests passam por ele 
    if ((req.headers["x-forwarded-proto"] || "").endsWith("http")) //Checa se o protocolo informado nos headers é HTTP 
        res.redirect(`https://${req.headers.host}${req.url}`); //Redireciona pra HTTPS 
    else //Se a requisição já é HTTPS 
        next(); //Não precisa redirecionar, passa para os próximos middlewares que servirão com o conteúdo desejado 
});



//ROUTES


app.get('/getDestaks', async function(req, res){     
    SQL_JSON("select * from articles where category like '%destak%'", res)   
});

app.get('/getMaisAcessados', async function(req, res){     
    SQL_JSON("select * from articles order by views desc limit 5", res)   
});

app.get('/erangel', async function(req, res){     
   res.render("erangel", {MAPA:"erangel"})
});

app.get('/miramar', async function(req, res){     
    res.render("miramar", {MAPA:"miramar"})
 });

 app.get('/vikendi', async function(req, res){     
    res.render("vikendi", {MAPA:"vikendi"})
 });

 app.get('/savage', async function(req, res){     
    res.render("savage", {MAPA:"savage"})
 });




app.get('/listPictures/:path', async function(req, res){     
    let arquivos = await listarArquivosDoDiretorio('./'+req.params.path);
    console.log(arquivos);
   
    res.send(arquivos);  
});




app.get('/realidade_aumentada', async function(req, res){   
    res.render('realidade_aumentada');
});

app.post('/sendContact', async function(req, res){   
    res.send(req.body);
});


app.get('/', async function(req, res){ 
    res.render("miramar", {MAPA:"erangel"})
});



app.post('/feedback', async function(req, res){ 
   
    console.log(req.body)
    var DADOS = req.body.colector
    var start, end, close, mapa
    for(const k in DADOS){
        if(DADOS[k].partida != undefined){start = DADOS[k].partida}
        if(DADOS[k].chegada != undefined){end = DADOS[k].chegada}
        if(DADOS[k].resultadoCorreto != undefined){close = DADOS[k].resultadoCorreto}
        if(DADOS[k].mapa != undefined){mapa = DADOS[k].mapa}

       
    }
    SQL_JSON("insert into ia_log values (null, '"+mapa+"', "+start+", "+end+", "+close+", now(), now())", res)
  

});








app.listen(3000);
console.log("Port "+3000)






/*=====================FUNCTIONS====================================
* Here is the functions of the main code
* Ronan Rodrigues
===================================================================*/

function OrdenaJson(lista, chave, ordem) {
    return lista.sort(function(a, b) {
        var x = a[chave];
        var y = b[chave];
        if (ordem === 'ASC') {
            return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        }
        if (ordem === 'DESC') {
            return ((x > y) ? -1 : ((x < y) ? 1 : 0));
        }
    });
}

//EXECUTA UMA QUERY EM UM DB
function SQL_void(sqlQry) {
    conn = mysql.createConnection({
        host: process.env.host_name,
        port: process.env.port_db,
        user: process.env.user_name,
        password: process.env.pass_key,
        database: process.env.database
    });
    console.log(sqlQry)
    conn.query(sqlQry, function(error, results, fields){
        if(error){         
            process.exit(1)
            console.log(error)
            conn.destroy()
            
        }else{       
            console.log("query ok")      
            conn.destroy()  
          
        }
          

    });
}

async function SQL_JSON(sqlQry,res){
    createConection()
    console.log(sqlQry)
    conn.query(sqlQry, function(error, results, fields){
        if(error){         
            //console.log(error)
            process.exit(1)
            res.json(error);
            conn.destroy()
        }else{       
            //console.log(results)        
            res.json(results);
            conn.destroy()
        }
          

    });
}

async function listarArquivosDoDiretorio(diretorio, arquivos) {

    if(!arquivos)
        arquivos = [];

    let listaDeArquivos = await fs.readdir(diretorio);
    for(let k in listaDeArquivos) {
        let stat = await fs.stat(diretorio + '/' + listaDeArquivos[k]);
        if(stat.isDirectory())
            await listarArquivosDoDiretorio(diretorio + '/' + listaDeArquivos[k], arquivos);
        else
            arquivos.push(diretorio + '/' + listaDeArquivos[k]);
    }

    return arquivos;

}

function enviaEmail(remetente, destinatario, assunto, html){
    if(html == ""){
        html = '<!doctype html><html ⚡4email data-css-strict><head><meta charset="utf-8"><style amp4email-boilerplate>body{visibility:hidden}</style><script async src="https://cdn.ampproject.org/v0.js"></script><style amp-custom>.es-desk-hidden {	display:none;	float:left;	overflow:hidden;	width:0;	max-height:0;	line-height:0;}.es-button-border:hover a.es-button, .es-button-border:hover button.es-button {	background:#004ED6;	border-color:#004ED6;}td .es-button-border:hover a.es-button-1 {	background:#FFFFFF;	border-color:#FFFFFF;	color:#FF294A;}td .es-button-border-2:hover {	background:#FFFFFF;	border-color:#FFFFFF #FFFFFF #FFFFFF #FFFFFF;}td .es-button-border:hover a.es-button-3 {	background:#27A76E;	border-color:#27A76E;}td .es-button-border-4:hover {	background:#27A76E;}s {	text-decoration:line-through;}body {	width:100%;	font-family:"Open Sans", sans-serif;}table {	border-collapse:collapse;	border-spacing:0px;}table td, html, body, .es-wrapper {	padding:0;	Margin:0;}.es-content, .es-header, .es-footer {	table-layout:fixed;	width:100%;}p, hr {	Margin:0;}h1, h2, h3, h4, h5 {	Margin:0;	line-height:120%;	font-family:roboto, "helvetica neue", helvetica, arial, sans-serif;}.es-left {	float:left;}.es-right {	float:right;}.es-p5 {	padding:5px;}.es-p5t {	padding-top:5px;}.es-p5b {	padding-bottom:5px;}.es-p5l {	padding-left:5px;}.es-p5r {	padding-right:5px;}.es-p10 {	padding:10px;}.es-p10t {	padding-top:10px;}.es-p10b {	padding-bottom:10px;}.es-p10l {	padding-left:10px;}.es-p10r {	padding-right:10px;}.es-p15 {	padding:15px;}.es-p15t {	padding-top:15px;}.es-p15b {	padding-bottom:15px;}.es-p15l {	padding-left:15px;}.es-p15r {	padding-right:15px;}.es-p20 {	padding:20px;}.es-p20t {	padding-top:20px;}.es-p20b {	padding-bottom:20px;}.es-p20l {	padding-left:20px;}.es-p20r {	padding-right:20px;}.es-p25 {	padding:25px;}.es-p25t {	padding-top:25px;}.es-p25b {	padding-bottom:25px;}.es-p25l {	padding-left:25px;}.es-p25r {	padding-right:25px;}.es-p30 {	padding:30px;}.es-p30t {	padding-top:30px;}.es-p30b {	padding-bottom:30px;}.es-p30l {	padding-left:30px;}.es-p30r {	padding-right:30px;}.es-p35 {	padding:35px;}.es-p35t {	padding-top:35px;}.es-p35b {	padding-bottom:35px;}.es-p35l {	padding-left:35px;}.es-p35r {	padding-right:35px;}.es-p40 {	padding:40px;}.es-p40t {	padding-top:40px;}.es-p40b {	padding-bottom:40px;}.es-p40l {	padding-left:40px;}.es-p40r {	padding-right:40px;}.es-menu td {	border:0;}a {	text-decoration:none;}p, ul li, ol li {	font-family:"Open Sans", sans-serif;	line-height:150%;}ul li, ol li {	Margin-bottom:15px;}.es-menu td a {	text-decoration:none;	display:block;}.es-menu amp-img, .es-button amp-img {	vertical-align:middle;}.es-wrapper {	width:100%;	height:100%;	background-color:#030E20;}.es-wrapper-color {	background-color:#030E20;}.es-header {	background-color:#0050D8;}.es-header-body {	background-color:#0C66FF;}.es-header-body p, .es-header-body ul li, .es-header-body ol li {	color:#EFEFEF;	font-size:12px;}.es-header-body a {	color:#FFFFFF;	font-size:12px;}.es-content-body {	background-color:#FEFEFE;}.es-content-body p, .es-content-body ul li, .es-content-body ol li {	color:#8492A6;	font-size:14px;}.es-content-body a {	color:#0C66FF;	font-size:14px;}.es-footer {	background-color:#141B24;}.es-footer-body {	background-color:#273444;}.es-footer-body p, .es-footer-body ul li, .es-footer-body ol li {	color:#8492A6;	font-size:12px;}.es-footer-body a {	color:#FFFFFF;	font-size:12px;}.es-infoblock, .es-infoblock p, .es-infoblock ul li, .es-infoblock ol li {	line-height:120%;	font-size:16px;	color:#FFFFFF;}.es-infoblock a {	font-size:16px;	color:#FFFFFF;}h1 {	font-size:26px;	font-style:normal;	font-weight:bold;	color:#3C4858;}h2 {	font-size:18px;	font-style:normal;	font-weight:normal;	color:#3C4858;}h3 {	font-size:16px;	font-style:normal;	font-weight:bold;	color:#888888;	letter-spacing:0px;}.es-header-body h1 a, .es-content-body h1 a, .es-footer-body h1 a {	font-size:26px;}.es-header-body h2 a, .es-content-body h2 a, .es-footer-body h2 a {	font-size:18px;}.es-header-body h3 a, .es-content-body h3 a, .es-footer-body h3 a {	font-size:16px;}a.es-button, button.es-button {	border-style:solid;	border-color:#0C66FF;	border-width:15px 30px 15px 30px;	display:inline-block;	background:#0C66FF;	border-radius:8px;	font-size:14px;	font-family:"Open Sans", sans-serif;	font-weight:bold;	font-style:normal;	line-height:120%;	color:#FFFFFF;	text-decoration:none;	width:auto;	text-align:center;}.es-button-border {	border-style:solid solid solid solid;	border-color:#0C66FF #0C66FF #0C66FF #0C66FF;	background:#0C66FF;	border-width:0px 0px 0px 0px;	display:inline-block;	border-radius:8px;	width:auto;}.es-p-default {	padding-top:20px;	padding-right:15px;	padding-bottom:0px;	padding-left:15px;}.es-p-all-default {	padding:0px;}@media only screen and (max-width:600px) {p, ul li, ol li, a { line-height:150% } h1 { font-size:28px; text-align:left; line-height:120% } h2 { font-size:20px; text-align:left; line-height:120% } h3 { font-size:14px; text-align:left; line-height:120% } h1 a { text-align:left } .es-header-body h1 a, .es-content-body h1 a, .es-footer-body h1 a { font-size:28px } h2 a { text-align:left } .es-header-body h2 a, .es-content-body h2 a, .es-footer-body h2 a { font-size:20px } h3 a { text-align:left } .es-header-body h3 a, .es-content-body h3 a, .es-footer-body h3 a { font-size:14px } .es-menu td a { font-size:14px } .es-header-body p, .es-header-body ul li, .es-header-body ol li, .es-header-body a { font-size:14px } .es-content-body p, .es-content-body ul li, .es-content-body ol li, .es-content-body a { font-size:14px } .es-footer-body p, .es-footer-body ul li, .es-footer-body ol li, .es-footer-body a { font-size:14px } .es-infoblock p, .es-infoblock ul li, .es-infoblock ol li, .es-infoblock a { font-size:14px } *[class="gmail-fix"] { display:none } .es-m-txt-c, .es-m-txt-c h1, .es-m-txt-c h2, .es-m-txt-c h3 { text-align:center } .es-m-txt-r, .es-m-txt-r h1, .es-m-txt-r h2, .es-m-txt-r h3 { text-align:right } .es-m-txt-l, .es-m-txt-l h1, .es-m-txt-l h2, .es-m-txt-l h3 { text-align:left } .es-m-txt-r amp-img { float:right } .es-m-txt-c amp-img { margin:0 auto } .es-m-txt-l amp-img { float:left } .es-button-border { display:inline-block } a.es-button, button.es-button { font-size:14px; display:inline-block } .es-btn-fw { border-width:10px 0px; text-align:center } .es-adaptive table, .es-btn-fw, .es-btn-fw-brdr, .es-left, .es-right { width:100% } .es-content table, .es-header table, .es-footer table, .es-content, .es-footer, .es-header { width:100%; max-width:600px } .es-adapt-td { display:block; width:100% } .adapt-img { width:100%; height:auto } td.es-m-p0 { padding:0px } td.es-m-p0r { padding-right:0px } td.es-m-p0l { padding-left:0px } td.es-m-p0t { padding-top:0px } td.es-m-p0b { padding-bottom:0 } td.es-m-p20b { padding-bottom:20px } .es-mobile-hidden, .es-hidden { display:none } tr.es-desk-hidden, td.es-desk-hidden, table.es-desk-hidden { width:auto; overflow:visible; float:none; max-height:inherit; line-height:inherit } tr.es-desk-hidden { display:table-row } table.es-desk-hidden { display:table } td.es-desk-menu-hidden { display:table-cell } table.es-table-not-adapt, .esd-block-html table { width:auto } table.es-social { display:inline-block } table.es-social td { display:inline-block } }</style></head>'+
'<body><div class="es-wrapper-color"> <!--[if gte mso 9]><v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t"> <v:fill type="tile" color="#030e20"></v:fill> </v:background><![endif]--><table class="es-wrapper" width="100%" cellspacing="0" cellpadding="0"><tr><td valign="top"><table class="es-header" cellspacing="0" cellpadding="0" align="center"><tr><td align="center" bgcolor="transparent" style="background-color: transparent"><table class="es-header-body" width="600" cellspacing="0" cellpadding="0" bgcolor="#0c66ff" align="center" style="background-color: #0c66ff"><tr><td class="es-p30t es-p30b es-p15r es-p15l" align="left" bgcolor="#0e0201" style="background-color: #0e0201"> <!--[if mso]><table width="570" cellpadding="0" cellspacing="0"><tr><td width="320" valign="top"><![endif]--><table cellpadding="0" cellspacing="0" class="es-left" align="left"><tr><td width="320" align="left"><table cellpadding="0" cellspacing="0" width="100%" role="presentation"><tr><td align="center" style="font-size: 0px"><amp-img class="adapt-img" src="https://printmer.com.br/images/LOGO BRANCA.png" alt style="display: block" width="320" layout="responsive"></amp-img></td>'+
'</tr></table></td></tr></table> <!--[if mso]></td><td width="20"></td><td width="230" valign="top"><![endif]--><table cellpadding="0" cellspacing="0" class="es-right" align="right"><tr><td width="230" align="left"><table cellpadding="0" cellspacing="0" width="100%" role="presentation"><tr class="es-mobile-hidden"><td align="center" height="40"></td></tr><tr><td align="left"><h3>BEM VINDO!</h3></td></tr><tr><td align="left"><h1>Obrigado pela assinatura!</h1></td></tr><tr><td align="left" class="es-p10t"><p style="color: #8492a6"><span style="font-size:14px">Acesse nosso conteúdo e deixe sua opinião!<br>Te informaremos sempre que houver atualizações.</span><span data-cke-bookmark="1" style="display: none">&nbsp;</span><br></p></td>'+
'</tr><tr><td align="left" class="es-m-txt-l es-p20t es-p20b"> <!--[if mso]><a href="https://printmer.com.br" target="_blank"> <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" stripoVmlButton href="https://printmer.com.br" style="height:46px;v-text-anchor:middle;width:200px;" arcsize="17%" stroke="f" fillcolor="#0c66ff"> <w:anchorlock></w:anchorlock> <center style="color:#ffffff;font-family:"Open Sans", sans-serif;font-size:14px;font-weight:700;">SAIBA MAIS</center> </v:roundrect></a><![endif]--> <!--[if !mso]><!-- --><span class="msohide es-button-border"><a href="https://printmer.com.br" class="es-button" target="_blank">SAIBA MAIS</a></span> <!--<![endif]--></td></tr></table></td></tr></table> <!--[if mso]></td></tr></table><![endif]--></td></tr></table></td>'+
'</tr></table><table class="es-content" cellspacing="0" cellpadding="0" align="center"><tr><td align="center"><table class="es-content-body" width="600" cellspacing="0" cellpadding="0" bgcolor="#fefefe" align="center"><tr><td class="es-p40t es-p20b es-p15r es-p15l" align="left"><table cellpadding="0" cellspacing="0" width="100%"><tr><td width="570" align="center" valign="top"><table cellpadding="0" cellspacing="0" width="100%" role="presentation"><tr><td align="center" class="es-m-txt-c"><h1>NOSSOS TEMAS</h1></td></tr><tr><td align="center" class="es-m-txt-c"><h3 style="color: #0c66ff"><br></h3></td></tr></table></td></tr></table></td>'+
'</tr><tr><td class="es-p20t es-p20b es-p15r es-p15l" align="left"> <!--[if mso]><table width="570" cellpadding="0" cellspacing="0"><tr><td width="285" valign="top"><![endif]--><table cellspacing="0" cellpadding="0" align="left" class="es-left"><tr><td class="es-m-p20b" width="285" valign="top" align="center"><table width="100%" cellspacing="0" cellpadding="0" role="presentation"><tr><td align="center" style="font-size: 0px"><a target="_blank" href="https://viewstripo.email/"><amp-img class="adapt-img b_image" src="https://printmer.com.br/images/identidadeVisual.jpg" alt style="display: block" width="285" height="380" layout="responsive"></amp-img></a></td></tr></table></td></tr></table> <!--[if mso]></td><td width="20"></td>'+
'<td width="265" valign="top"><![endif]--><table cellpadding="0" cellspacing="0" class="es-right" align="right"><tr><td width="265" valign="top" align="center"><table width="100%" cellspacing="0" cellpadding="0" role="presentation"><tr class="es-mobile-hidden"><td align="center" height="30"></td></tr><tr><td align="left" class="es-m-txt-l"><h3 style="color: #0c66ff" class="b_category">DESIGN</h3></td></tr><tr><td align="left" class="es-m-txt-l es-p10b"><h1 class="b_title">COMO TER UMA IDENTIDADE VISUAL</h1></td></tr><tr><td align="left"><p class="b_description">Conheça a melhor forma de cuidar da imagem da sua empresa ou carreira.</p></td>'+
'</tr><tr><td align="left" class="es-m-txt-l es-p20t es-p20b"> <!--[if mso]><a href="https://printmer.com.br/design" target="_blank"> <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" stripoVmlButton href="https://printmer.com.br/design" style="height:46px;v-text-anchor:middle;width:203px;" arcsize="17%" stroke="f" fillcolor="#0c66ff"> <w:anchorlock></w:anchorlock> <center style="color:#ffffff;font-family:"Open Sans", sans-serif;font-size:14px;font-weight:700;">SABER MAIS</center> </v:roundrect></a><![endif]--> <!--[if !mso]><!-- --><span class="msohide es-button-border"><a href="https://printmer.com.br/design" class="es-button" target="_blank">SABER MAIS</a></span> <!--<![endif]--></td></tr></table></td></tr></table> <!--[if mso]></td></tr></table><![endif]--></td>'+
'</tr><tr><td class="es-p20t es-p15r es-p15l" align="left"> <!--[if mso]><table width="570" cellpadding="0" cellspacing="0"><tr><td width="285" valign="top"><![endif]--><table cellspacing="0" cellpadding="0" align="left" class="es-left"><tr><td class="es-m-p20b" width="285" valign="top" align="center"><table width="100%" cellspacing="0" cellpadding="0" role="presentation"><tr><td align="center"><amp-img class="adapt-img" src="https://llyfge.stripocdn.email/content/guids/videoImgGuid/images/20981594209011887.png" alt width="285" height="285" layout="responsive"></amp-img></td></tr></table></td></tr></table> <!--[if mso]></td><td width="20"></td><td width="265" valign="top"><![endif]--><table cellpadding="0" cellspacing="0" class="es-right" align="right"><tr><td width="265" valign="top" align="center"><table width="100%" cellspacing="0" cellpadding="0" role="presentation"><tr class="es-mobile-hidden"><td align="center" height="30"></td>'+
'</tr><tr><td align="left" class="es-m-txt-l"><h3 style="color: #0c66ff" class="b_category">GAMES</h3></td></tr><tr><td align="left" class="es-m-txt-l es-p10b"><h1 class="b_title">PUBG, FREE FIRE E MAIS</h1></td></tr><tr><td align="left"><p class="b_description">Fique por dentro do que ocorre no mundo dos RPGs e demais games do momento.</p></td>'+
'</tr><tr><td align="left" class="es-m-txt-l es-p20t es-p20b"> <!--[if mso]><a href="https://printmer.com.br/design" target="_blank"> <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" stripoVmlButton href="https://printmer.com.br/design" style="height:46px;v-text-anchor:middle;width:203px;" arcsize="17%" stroke="f" fillcolor="#0c66ff"> <w:anchorlock></w:anchorlock> <center style="color:#ffffff;font-family:"Open Sans", sans-serif;font-size:14px;font-weight:700;">SABER MAIS</center> </v:roundrect></a><![endif]--> <!--[if !mso]><!-- --><span class="msohide es-button-border"><a href="https://printmer.com.br/design" class="es-button" target="_blank">SABER MAIS</a></span> <!--<![endif]--></td></tr></table></td></tr></table> <!--[if mso]></td></tr></table><![endif]--></td></tr></table></td>'+
'</tr></table><table class="es-footer" cellspacing="0" cellpadding="0" align="center"><tr><td align="center"><table class="es-footer-body" width="600" cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center"><tr><td class="es-p40t es-p40b es-p15r es-p15l" align="left"> <!--[if mso]><table width="570" cellpadding="0" cellspacing="0"><tr><td width="180" valign="top"><![endif]--><table class="es-left" cellspacing="0" cellpadding="0" align="left"><tr><td class="es-m-p20b" width="180" align="left"><table width="100%" cellspacing="0" cellpadding="0" role="presentation"><tr><td align="center" class="es-m-txt-c" style="font-size: 0px"><a target="_blank" href="https://viewstripo.email/"><amp-img src="https://printmer.com.br/images/LOGO BRANCA.png" alt style="display: block" width="150"></amp-img></a></td></tr></table></td></tr></table> <!--[if mso]></td><td width="20"></td>'+
'<td width="370" valign="top"><![endif]--><table class="es-right" cellspacing="0" cellpadding="0" align="right"><tr><td width="370" align="left"><table width="100%" cellspacing="0" cellpadding="0" role="presentation"><tr><td align="left" class="es-m-txt-c es-p20t es-p20b"><p>Venha participar dessa comunidade!<br><br></p></td></tr></table></td></tr></table> <!--[if mso]></td></tr></table><![endif]--></td></tr></table></td></tr></table></td></tr></table></div></body></html>';

    }


  const transporter = nodemailer.createTransport({
    
    host: 'smtp.umbler.com',
    port: 587,
    secure: false, // use SSL
    auth: {
                user: 'gamora@printmer.com.br',
                pass: 'poupa22ST@'
            }
  
   });


  
   const mailOptions = {
     from: remetente,
     to: destinatario,
     subject: assunto,   
     html:html
   };

   transporter.sendMail(mailOptions, function(error, info){
     if (error) {
       console.log(error);
     } else {
        res.send('Email enviado');
       console.log('Email enviado: ' + info.response);
     }
   });
}

function enviaEmail2(remetente, destinatario, assunto, html2){
    


    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
               user: 'kaizen.ti.2019@gmail.com',
               pass: 'mdt1234@'
           }
    });
    
    const mailOptions = {
        from: remetente, // sender address
        to: destinatario, // list of receivers
        subject: assunto, // Subject line
        html: html2,// plain text body
        headers: {
            'collection': 'Pipelines',
            'doc-ID': 'mydocid'
        }
    };
    
    transporter.verify(function(error, success) {
        if (error) {
          console.log(error);
        } else {
          console.log("Server is ready to take our messages");
        }
    });
    
    transporter.sendMail(mailOptions, function (err, info) {
        if(err)
          console.log(err)
        else
          console.log(info);
          console.log("enviado com sucesso...");
    });
}

function createConection(){
    conn = mysql.createConnection({
        host: process.env.host_name,
        port: process.env.port_db,
        user: process.env.user_name,
        password: process.env.pass_key,
        database: process.env.database
    });
}





