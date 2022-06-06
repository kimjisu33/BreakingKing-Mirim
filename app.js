const express=require('express')
    ,http=require('http')
    ,path=require('path');

const fs=require('fs');

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


let test;
app.get('/mysql', (req, res)=>{
  connection.query('select * from score order by score desc',(err,rows)=>{
    if(err) throw err;
    
    //res.send(rows); 
    
    test=rows;
    console.log(test[0]);
  });
  res.redirect('/rank');
});

app.get('/rank',(req, res)=>{
  fs.readFile(__dirname+'/public/rank/rank.html',function(err,data){
    if(err){
      console.log(err);
    }else{
      res.writeHead(200,{'Context-Type':'text/html'});
      res.write(data);
      
      test.forEach(element => {
        res.write(`<table style="background-color: aqua; margin-left: 460px;"><tr style="background-color: red; height: 100px;"><td style="width: 300px;">${element.name}</td><td style="width: 700px;">${element.score}</td></tr></table>`);
      });
      
      res.end();
    }
  });
});


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
