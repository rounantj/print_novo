var express = require('express')
var app = express();
const handlebars = require('express-handlebars');
const bodyParser = require('body-parser')
const nodemailer = require('nodemailer');

const mysql      = require('mysql');
const conn = mysql.createConnection({
  host     : 'localhost',
  port     : 3306,
  user     : 'root',
  password : '',
  database : 'cipa'
});







app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
app.use(express.static('public'));
app.engine('handlebars', handlebars({defaultLayout:'main'}))
app.set('view engine', 'handlebars')
var cors = require('cors')
app.use(express.json())


app.get('/predators-inscricao', async function(req, res){
  
  res.render("index")
});



app.listen(3000);
console.log("Port 3000")




function execSQLQuery(sqlQry) {

  console.log(sqlQry)
	conn.query(sqlQry, function (error, results, fields) {

	});
}

function queryJSON(sqlQry, res){
 
 
  conn.query(sqlQry, function(error, results, fields){
      if(error) 
        res.json(error);
      else
        res.json(results);
     // conn.end();
     // console.log('executou!');
  });
}