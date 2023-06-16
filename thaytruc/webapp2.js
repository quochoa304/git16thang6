const express = require("express");
const app = express();
const fobj= require('fs');
const stuM = require("./studentM");
const courses = [
    {id:1, name:'courses1'},
    {id:2, name:'courses2'},
    {id:3, name:'courses3'}
];


const router = express.Router();

app.use('/api/courses/students',stuM);
app.use(express.json());


// '/api/courses'

router.get('/api/courses', (req,res)=>{
    res.status(200).send(courses);

})

/*router.get('/api/courses/:id/:name',(req,res)=>{
    res.status(200).send(req.params);
})*/

router.get('/api/nonblocking',async (req,res)=>{
    var d = 10; 
    //setTimeout(()=>{console.log('count:',add(5,5))},15000); 
    //d = await add(20,10);
    console.log('Hello World 2!!!');
    res.send('test nonblocking');
    console.log('Value of d:', await add(20,10));
});

async function add(a,b){
    //const c = a +b ;
    //var c = 0;
    setTimeout(()=> { c = a +b ; return c;}, 1000);
    
}


router.get('/api/courses/:name/:DayOfBirth/:MonthofBirth/:YearofBirth',(req,res)=>{
    //res.status(200).send(req.params);
    //students.push(req.params);
    //console.log(students);
    var DayOfBirth, MonthofBirth, YearofBirth;
    DayOfBirth = parseInt(req.params.DayOfBirth);
    MonthofBirth = parseInt(req.params.MonthofBirth);
    YearofBirth = parseInt(req.params.YearofBirth);
    
   var myJSONobj = {
        "name": req.params.name,
        "DayOfBirth": DayOfBirth,
        "MonthofBirth": MonthofBirth,
        "YearofBirth": YearofBirth
   }
   if (!checkValidation(DayOfBirth,MonthofBirth,YearofBirth)){
        res.send(`Birthday of input student ${DayOfBirth}/${MonthofBirth}/${YearofBirth} is not valid. Please input again`);
    }
    else{

        // check if duplication
        const dupstudent = students.find(e => {
            return e.name === myJSONobj.name && e.DayOfBirth == myJSONobj.DayOfBirth
                && e.MonthofBirth == myJSONobj.MonthofBirth && e.YearofBirth == myJSONobj.YearofBirth;
        });

        if (!dupstudent){
            students.push(myJSONobj);
            res.status(200).send(`Successfully Input Student ${DayOfBirth}/${MonthofBirth}/${YearofBirth} to the Data!!!`);
        }
        else{
            res.status(400).send(`this student alreadry existed : ${dupstudent}`);
        }
    }

})



function checkValidation(day,month,year){
    if (year <=1950 || year>=2023){
        return false;
    }
    if (month<1 || month>12){
        return false;
    }
    switch (month){
        case 1,3,5,7,8,10,12: 
        if (day<1 || day>31) {
            return false;
        }
        break;
        case 2:
            if (day<1 || day>29) {
                return false;
            }
            break; 
        default:
            if (day<1 || day>30) {
                return false;
            }
    }
    return true;
}


router.get('/home', (req,res) => { 
    res.set('Content-Type','text/html');
    res.status(200).send('<h1> This is Home page. This is home router</h1>');
});

router.get('/about', (req,res) => { 
    res.set('Content-Type','text/html');
    res.status(200).send('<h1> This is About page. This is About router </h1>');
});

router.get('/literature', (req,res) => { 
    res.set('Content-Type','text/plain');
    const fcontent = fobj.readFileSync('./alice.txt');
    res.status(200).send(fcontent.toString());
}); 

app.use('/', router);

const port = process.env.port ||3000;
app.listen(port);
console.log('Web Server is listening at port' + port);

//console.log(`check (30/2/2013) ${checkValidation(30,2,2013)}`);

