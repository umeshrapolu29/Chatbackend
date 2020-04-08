const mongo = require('mongodb').MongoClient;
const client = require('socket.io').listen(4000).sockets;
var db=require('./Database/db');
var mongoose=require('mongoose');
const express = require('express');
const route=express.Router();
const app = express()
var url=db.url
 

var multer=require('multer');
 
// Todo - profile pic upload
var storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'./uploads/images');
    },
     filename:function(req,file,cb){  
         var file=file.originalname;
        cb(null,file);
        console.log(file+"file name is");
  
    }
});

var upload=multer({storage:storage});

// ! 
// app.get('/',upload.single(''),(req, res) => {
//     console.log("inside")
//      res.send("hello");
// })

// ! Mongo DB connection
mongoose.connect(url, function(err, db){
    if(err){
        throw err;
    }

    console.log('MongoDB connected...');
    let test="tested"

    // Connect to Socket.io
    client.on('connection', function(socket){
        
        console.log(" SOCKET CONNECTED....!!!")
       
        db_user=socket.request._query['user']
        init=socket.request._query['init']

        console.log(db_user)
        console.log(socket.request._query['init'])

        //socket.emit('join','Welcome to chat')
        // let chat = db.collection("db_user");
        


        // Create function to send status
        sendStatus = function(s){
            console.log("sending status: "+s)
            socket.emit('status', s);
        }

        socket.on('join',function(data){
            console.log("user data : "+data)
           
                id2=data.friend+"_"+data.user
                id1=data.user+"_"+data.friend
            
            
            let chat = db.collection(id1);
            let chat2 = db.collection(id2);
            chat.find().limit(100).sort({_id:1}).toArray(function(err, res){
                if(err){
                    throw err;
                }
    

                socket.emit('load', res);
                //   test="nottested";  
                
            });
        })

        // Get chats from mongo collection
        // chat.find().limit(100).sort({_id:1}).toArray(function(err, res){
        //     if(err){
        //         throw err;
        //     }

        //     // Emit the messages
        //     console.log("in chat . find")
        //     socket.emit('output', res);
        // });

        // Handle input events
//  Register , Message


        socket.on('input', function(data){
            console.log("data fetched: "+data.user+"  "+data.friend)
            

            // let id1=""
            // let id2=""

            // if(db_user=="kiran"){
            //     id1="kiran_umesh"
            //     id2="umesh_kiran"
            // }
            // else if (db_user=="umesh")
            // {
            //     id2="kiran_umesh"
            //     id1="umesh_kiran"
            // }
            id2=data.friend+"_"+data.user
            id1=data.user+"_"+data.friend
            let chat = db.collection(id1);
            let chat2 = db.collection(id2);
           
            
            let name = data.user;
            let message = data.message;

            console.log("user name is: "+name)

            // Check for name and message
            if(name == '' || message == ''){
                // Send error status
                sendStatus('Please enter a name and message');
            } else {
                // Insert message
                chat.insert({name: name, message: message}, function(){
                    client.emit('message', data);

                    // Send status object
                    sendStatus({
                        message: 'Message sent',
                        clear: true
                    });
                });
                chat2.insert({name: name, message: message}, function(){
                    // client.emit('output', [data]);

                    // Send status object
                    sendStatus({
                        message: 'Message sent',
                        clear: true
                    });
                });
            }
        });

        // Handle clear
        socket.on('clear', function(data){
            // Remove all chats from collection
            chat.remove({}, function(){
                // Emit cleared
                socket.emit('cleared');
            });
        });
    });
});
