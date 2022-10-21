const express=require('express')
    ,http=require('http')
    ,path=require('path');

const fs=require('fs');

const bodyParser = require('body-parser')
    , static = require('serve-static');

const app=express();

const mysql     = require('mysql');
const db 	= require('./config/database.js');

app.use(bodyParser.urlencoded({extended:false}));

app.set('port', process.env.PORT || 3006);

app.use(static(path.join(__dirname, 'public')));

app.post('/rank_insert',(req,res)=>{
  let name=req.body.name;
  let score=Number(req.body.score);
  db.query('insert into score values (?,?);',[name,score], (err,results,fields)=>{
    if(err) throw err;
    res.redirect("/popup/success.html");
    res.end();
  });

});


let select_result={};
app.get('/rank',(req, res)=>{
  db.query('select * from score order by score desc;',(err,rows)=>{
    if(err) throw err;
    select_result=rows;
  });

  fs.readFile(__dirname+'/public/rank/rank.html',function(err,data){
    if(err){
      console.log(err);
    }else{
      res.writeHead(200,{'Context-Type':'text/html'});
      res.write(data);
      
      let rank=1;
      res.write('<table style="margin-left: 530px; margin-bottom:100px;">');
      for(let i of select_result){
        res.write(`<tr style="height: 100px; font-size: 50px;">`);
        if(rank<=3) res.write(`<td style="width: 150px;"><img src="../img/${rank++}.png" width="100px" height="100px"></td>`);
        else res.write(`<td style="width: 130px;">${rank++}</td>`);
        res.write(`   
            <td style="width: 300px;">${i.name}</td>
            <td style="width: 400px;">${i.score}</td>
          </tr>
        `);
        if(rank>10) break;
      };
      res.write('</table>');
      
      res.end();
    }
  });
});


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
