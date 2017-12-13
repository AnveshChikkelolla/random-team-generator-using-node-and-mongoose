let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let fs = require('fs');
app.use(bodyParser());
let mongoose = require('mongoose');
mongoose.connect('localhost:27017/mydb20');
let Schema = mongoose.Schema;
let userDataSchema = new Schema({
             name: {type: String, required: true},
             branch: {type: String, required: true} 
            }, {collection: 'userdata'});
let userdata = mongoose.model('userdata', userDataSchema);
fs.appendFile('loginDetails.txt'," File accessed at " + new Date()+"\n",function(err){
if(err) throw err;});
app.get('/',function(req,res,next)
{
    res.sendFile('index.html',{root: './'});
});
app.post('/', function (req, res)
{
 let file=req.body.name;
 fs.readFile(file, 'utf8', function (err, data) {
   if (err) throw err;
   let json = JSON.parse(data);
   userdata.collection.insertMany(json, function (err, docs) {
      if (err) {
          res.send("Error to Accesss the database");
      } else {
          console.log(' successfully stored');
          res.sendFile('index1.html',{root: './'});
      }
  });
 });
});
app.post('/teams', function (req, res)
{
 let no_of_teams=req.body.no_of_teams;
 userdata.find({},{"_id":0}, function(err, data){
   console.log("Successfully retrieve the file from database/n"  ); 
   if(no_of_teams>0)
    {	 
      let shuffle = require('shuffle-array');
      console.log(data);
      shuffle(data);
      console.log(data);
      let i=0;
      let count=0;
      while(data[i++]!=null){                                     
          count++;    }
      console.log("no of students in given file are "+count);
      let total_students=count;
      let min_studentsofeachteam=parseInt(total_students/no_of_teams);
      if(min_studentsofeachteam!=0)                                       
           {                                    
               let exta_members=total_students%no_of_teams;  
               let z=0;
               let team_no=1;
               let sizeofteam=1;
               let temp=0;
               fs.writeFile('output.txt',"team no:"+team_no+"\n",function(err){                    
               if(err) throw err;});
               res.write("team no:"+team_no+"\n")               
               team_no++;
               while (z<total_students)                                        
                   {               
                         if(sizeofteam<=min_studentsofeachteam)
                         {
                                     fs.appendFile('output.txt', JSON.stringify(data[z])+"\n",function(err){
                                      if(err) throw err;  });
                                      res.write(data[z]+"\n")
                                      z++;                                                
                                     sizeofteam++;
                         }
                        else if(exta_members!=0){
                                        fs.appendFile('output.txt',JSON.stringify(data[z])+"\n",function(err){
                                        if(err) throw err;});
                                        res.write(data[z]+"\n")
                                        z++;
                                        exta_members--;
                                        temp=exta_members;
                                         exta_members=0;
                                        }
                        else {
                                  fs.appendFile('output.txt',"team no:"+team_no+"\n",function(err){
                                  if(err) throw err;  });
                                  res.write("team no:"+team_no+"\n")
                                  team_no++;
                                  sizeofteam=1;
                                  exta_members=temp;	  
                             }
      
                   }    
                   res.end("succesfully generated teams");
           }   
             else {(res.end("Number of teams exceed number of students") );}    
       
   
   
    }
    else {(res.end("You entered invalid number of teams ") );}    
      });
 });
 app.listen(8081, function () {
 console.log("Listening port 8081");
 });