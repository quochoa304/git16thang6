const express = require('express');
const router = express.Router();
const Joi = require("joi");
const fobj= require('fs');
const mongoose = require('mongoose');

const studentFN = "./studentdata.txt";
var students = [];

router.use(express.json());

const studentSchema = new mongoose.Schema({
    //{"name":"Nguyễn Bính","DayOfBirth":15,"MonthofBirth":9,"YearofBirth":1978}
    name: String,
    DayOfBirth: Number,
    MonthofBirth: Number,
    YearofBirth: Number
});

const StudentClass =  mongoose.model('Students',studentSchema);

//try to connect to the database named "mystudents"
router.get('/connectDB',(req,res)=>{
    mongoose.connect('mongodb://localhost/mystudents')
    .then(()=> {
        console.log('The database is already connected');
        //res.status(200).send('The database is already connected');
    })
    .catch(err => {
        console.error('could not connect to MongoDB',err);
        res.status(400).send(`could not connect to MongoDB ${err}`);
    });

    console.log('successfully creating the model');
    res.status(200).send('The database is already connected and modeled');
});

router.get('/load', (req,res)=>{


    //eq = equal
    //ne = not equal
    //gt = greater than 
    //gte = greater than or equal to
    //lt = less then
    //lte = less then or equal to
    //in = in
    //nin = not in
 
    try{
        //const buf = fobj.readFileSync(studentFN);
        //students = JSON.parse(buf);

        /*StudentClass.find({YearofBirth: {$gt: 2000}}, (students)=>{
            console.log(students);
            res.status(200).send(students);
        });   */
         
        StudentClass.find({YearofBirth: {$lt: 2004, $gt: 1980}, MonthofBirth: 5})
          .then((students)=>{
            console.log(students);
            res.status(200).send(students);
        });
    }
    catch(err){
        res.status(400).send('Student File does not exists.');
    }
});

router.get('/newsave', (req,res)=>{
    try{
        fobj.writeFileSync(studentFN,JSON.stringify(students));
        res.status(200).send(`The student data is successfully stored to the file ${studentFN}`);
    }
    catch(err){
        res.status(400).send('Error Ocurred!!!!');
    }

});

router.get('/',(req,res)=>{
    res.status(200).send(students);
})

 router.post('/append',(req,res) => {
    //validate the student information
    
    const {error} = checkValidation2(req.body);
    if (error) return res.status(400).send('Bad Json input!!!'); 

    StudentClass
        .find(req.body)
        .then((dupstudent)=>{
            if (dupstudent.length == 0){
                const studentdata = new StudentClass(req.body);
                studentdata.save()
                           .then(result => console.log(result));
                res.status(200).send('Successfully Input Student' +  req.body+ 
                                               'to the Data!!');
            }
            else{
                res.status(400).send('this student alreadry existed :' + dupstudent);
            }
        })

    
})

function checkValidation2(student){
    const schema = {
        name: Joi.string().min(3).max(30).required(),
        DayOfBirth: Joi.number().integer().min(1).max(31).required(),
        MonthofBirth: Joi.number().integer().min(1).max(12).required(),
        YearofBirth: Joi.number().integer().min(1951).max(2023).required()
    }
    
    const result = Joi.validate(student,schema);
    if (result.error) return result; 
    
    const schema2 = {
        date: Joi.date().required()
    }
    
    const result2 = Joi.validate({"date": Date.parse(`${student.YearofBirth}-${student.MonthofBirth}-${student.DayOfBirth}`)},schema2);
    return result2;
 }

module.exports = router;
module.exports.chkValidDate = checkValidation2;