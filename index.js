var express = require("express");
var app = express();
app.set("view engine", "ejs");
app.set("views", "./views");
app.use(express.static("public"));
app.listen();
var  ObjectIdd = require("mongodb").ObjectId;

var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended:false}))
const mongoose = require('mongoose');

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb+srv://qhoa:NGQRuTd1DkVHsPjf@toystore.hxhpwrh.mongodb.net/');
}

//upload
//multer
var multer  = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/upload')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now()  + "-" + file.originalname)
    }
});  
var upload = multer({ 
    storage: storage,
    fileFilter: function (req, file, cb) {
        console.log(file);
        if(file.mimetype=="image/bmp" ||
           file.mimetype=="image/png"||
           file.mimetype=="image/gif"||
           file.mimetype=="image/jpg"||
           file.mimetype=="image/jpeg" ||
           file.mimetype=="image/webp"
         ){
            cb(null, true)
        }else{
            return cb(new Error('Only image are allowed!'))
            
        }
    }
}).single("fileImage");

const Items = require("./models/items");

const { object, assert, func } = require("joi");
const { ObjectId } = require("mongodb");
const { name } = require("ejs");

app.post("/page/newcat", function (req, res) {

  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      console.log("A Multer error occurred when uploading."); 
      res.json({kq:0});
    } else if (err) {
      console.log("An unknown error occurred when uploading." + err);
      res.json({kq:0});
    }else{
        console.log("Upload is okay");
        //
        var item = new Items({
            Name: req.body.txtName,
            image: req.file.filename,
            price: req.body.txtPrice,
            quantity:req.body.txtQuantity,
            descrip:req.body.txtDetail
          });
          item.save()
          .then(function (models) {
            console.log(models);
            res.render("home",{page:"newcat", message:"Save sucessfull"});
          })
          .catch(function (err) {
            console.log(err);
            res.render("home",{page:"newcat", message:"Save fail, please check the format !!"});
          });
    }

});
      
});


app.get("/page/item", function (req, res) {
    Items.find()
  .then(function (models) {
    console.log(models);
    res.render("home",{page:"item", items:models});
    
  })
  .catch(function (err) {
    console.log(err);
    res.render("home",{page:"item", items:[]});
  });
  
});

app.get("/page/find", function (req, res) {
  var name = req.body.findName;
  Items.find({Name: name})
.then(function (models) {
  console.log(models);
  res.render("home",{page:"item", items:models});
  
})
.catch(function (err) {
  console.log(err);
  res.render("home",{page:"item", items:[]});
});

});



app.get("/", function(req, res){
    res.render("home",{page: "home"});
});

app.get("/page/:p", function(req, res){
  res.render("home",{page: req.params.p});
});

app.get("/login", function(req, res){
    res.render("login");
});
app.get("/register", function(req, res){
  res.render("register");
});

app.get("/about", function(req, res){
  res.render("about");
});

app.get("/page/item", function (req, res) {
  Items.find()
  .then(function (models) {
    console.log(models);
    res.render("home",{page:"item", items:models});
    
  })
  .catch(function (err) {
    console.log(err);
    res.render("home",{page:"item", items:[]});
  });

});


app.get('/delete/(:id)', function(req,res){
  Items.findByIdAndDelete(req.params.id )
  .then(function (Items) {
    console.log(Items);  
    res.redirect("http://localhost:3200/page/item")
  })
  .catch(function (err) {
    console.log(err);
    res.render("home",{page:"item", items:[]});
  });
});


app.get('/find', function(req,res){
  Items.findOne(req.body.findName )
  .then(function (Items) {
    console.log(Items);  
    res.redirect("http://localhost:3200/page/find")
  })
  .catch(function (err) {
    console.log(err);
    res.render("home",{page:"find", items:[]});
  });
});


app.post('/update/(:id)', function(req,res){
  var item = new Items({
    Name: req.body.txtName,
    image: req.file.filename,
    price: req.body.txtPrice,
    quantity:req.body.txtQuantity,
    descrip:req.body.txtDetail
  });
  Items.findByIdAndUpdate(req.params.id, item )
  .then(function (Items) {
    console.log(Items);  
    res.redirect("http://localhost:3200/page/item")
  })
  .catch(function (err) {
    console.log(err);
    res.render("home",{page:"item", items:[]});
  });
});


app.post('/update', function(req,res){
  var item = new Items({
    Name: req.body.txtName,
    price: req.body.txtPrice,
    quantity:req.body.txtQuantity,
    descrip:req.body.txtDetail
  });
  var id = req.body.txtID;
  Items.updateOne({_id:new ObjectIdd(id)}, {$set:item})
  .then(function (Items) {
    console.log(Items);  
    res.render("home",{page:"update", mess:"Update sucessfull"});
  })
  .catch(function (err) {
    console.log(err);
    res.render("home",{page:"update", mess:"Update fail"});
  });
})


