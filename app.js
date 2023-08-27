
const express=require("express");
const bodyParser=require("body-parser");

const app=express();

const date=require(__dirname+"/date.js");

app.use(express.static("public"));

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

// console.log(date());

var lists=[];
var Name="";
var work_list=[];

app.get("/",function(req,res){


    var today=date();
   
    res.render('index',{ListTitle:today,item_to_add:lists,name:Name})
    

});

app.post("/",function(req,res){
    
    var item=req.body.item_to_add;
    var checkname=req.body.fname;
    var checkpage=req.body.list;

   

    
    if(checkpage==="work list"){
        
        work_list.push(item);
        res.redirect("/work");
        
    }
    else{

        
        if(checkname.length>1){
    
            Name=checkname;
            
        }
    
        lists.push(item);
        
        // console.log(item);
    
    
       res.redirect("/");

    }


});

app.get("/work",function(req,res){
    
    res.render("index",{ListTitle: "work list",item_to_add:work_list,name:Name});
    
});


app.get("/about",function(req,res){

    res.render("about");

});

app.listen(3000,function(){

    console.log("server is running at port : 3000");

})

