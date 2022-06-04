const express=require('express')
    ,http=require('http')
    ,path=require('path');


const bodyParser = require('body-parser')
    , static = require('serve-static');

const app=express();

const mysql=require('mysql');
const dbconfig=require('./config/database.js');
const connection=mysql.createConnection(dbconfig);

app.set('port', process.env.PORT || 3000);

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json())

app.use(static(path.join(__dirname, 'public')));

app.get('/users', (req, res)=>{
  connection.query('select * from score',(err,rows)=>{
    if(err) throw err;
    console.log(rows[0].name);
    res.send(rows);
  });
});


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
