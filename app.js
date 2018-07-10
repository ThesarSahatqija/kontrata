const express = require('express');

const app = express();
//Setup templates
app.set('views',__dirname+"/views");
app.set('view engine','ejs');
app.use(express.static(__dirname +'/public'));

// Setup database
const MongoClient = require('mongodb').MongoClient;
const mongoURL = 'mongodb://localhost:27017/todos';
const objectID = require('mongodb').ObjectId;
// Connect to mongodb
MongoClient.connect(mongoURL,function(err,database){
  if(err){
      console.log(err)
      return;
  }
  console.log("database connected succesfuly");
  todos = database.collection("list")
});

const bodyParser = require('body-parser');

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.get('/',function(req,res){
    todos.find().toArray(function(err,docs){
        if (err){
            console.log(err);
        }
        res.render("index",{ docs: docs});
    })

});

//Routes -Controllers
app.get('/todos/:id',function(req,res){
    const id = objectID(req.params.id);
    todos.findOne({_id: id},function(err,doc){
        if(err){
            console.log(err);
        }
        res.render("show",{doc: doc});
    });

});

app.post('/todos/add', function(req, res) {
    // Logic to insert into db
    todos.insert(req.body, function(err, result) {
       if (err) {
          console.log(err);
       }
       res.redirect('/');
    });
 });

app.get('/todos/edit/:id',function(req,res){
    const id = objectID(req.params.id);
    todos.findOne({_id:id},function(err,doc){
        if(err){
            console.log(err);
        }
        res.render("edit",{doc:doc});
    });

});

app.post('/todos/update/:id',function(req,res){ 
    const id =objectID(req.params.id);
    //query
    todos.updateOne({_id:id}, {$set: req.body}, function(err,result){
        if (err){
            console.log(err);
        }
        res.redirect('/');
    });
});

app.get('/todos/delete/:id',function(req,res){
    const id = objectID(req.params.id);
    todos.deleteOne({_id:id},function(err,result){
        if (err){
            console.log(err);
        }
        res.redirect('/');
    });

});

app.listen(3000,function() {
    console.log('app running at httpL//localhost:3000');
});
