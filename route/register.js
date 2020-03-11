
const express = require('express') 
var users = express.Router();

var mongoose=require('mongoose');
// var Schema=require('../Model/Schema');
var db=require('../Database/db');
var multer=require('multer');
var registerschema=require('../Database/modal/schema');
var url=db.url
var storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'./uploads/images');
    },
     filename:function(req,file,cb){  
        // console.log(new Date().getMinutes+"time before");
         var file=file.originalname;
        cb(null,file);
        console.log(file+"file name is");
  
    }
});
var upload=multer({storage:storage});

function getData(res,data){
    res.send("ggg");
 //console.log(data);
}

users.post('/register',upload.single(''),(req,res,callback)=>{
    var firstname=req.body.firstname;
    var lastname=req.body.lastname;
    var email=req.body.email;
    var phone=req.body.phone;
    console.log(firstname,lastname,email,phone+"data");
    // var yourname=req.body.yourname;
    // var friendname=req.body.friendname;
    // var myData = {
    //     you: yourname, // ww w .j a  v a  2s.  c  o  m
    //     friend: friendname 
    // }; 
  
    // console.log(yourname,friendname);
    var dbResponse={}
    
    mongoose.connect(url, function(err, db){
        if(err){
            throw err;
        }
        else{
           
        //     let chat2 = db.collection('register');
        //     chat2.insert({firstname:firstname,lastname:lastname,email:email,phone:phone}).then(result=>{
        //        callback(null,result);              
        //        dbResponse=result
        //      console.log(dbResponse);
            
              
        //    }).catch(error=>{
        //        callback(null,error);
          
        // })
          var reg=new registerschema({
            firstname:firstname,
            lastname:lastname,
            email:email,
            phone:phone
         })
         reg.save().then(result=>{
             callback(null,result);
             console.log("res------->")
             console.log(result);
        
         }).catch(error=>{
             callback(null,error);
         })
      

        
        
        
         }
    })
    console.log("-------------------->")
    
      res.send(firstname)
   
})
module.exports = users;