
const express=require("express");
const bodyParser=require("body-parser");
const mongoose=require("mongoose");
const { todo } = require("node:test");

const app=express();

const date=require(__dirname+"/date.js");

app.use(express.static("public"));

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));


mongoose.connect("mongodb://127.0.0.1:27017/todolistDB")
.then(
    ()=>{
        console.log("successfull.......");
    }
)
.catch((err)=>{
    console.log(err);
})


const ItemsSchema={
    name:String
};

const Item=mongoose.model("todayItem",ItemsSchema);

const ListsSchema={
    name:String,
    items:[ItemsSchema]     
}

const List=mongoose.model("list",ListsSchema);

const work1=new Item({
    name:"eat"
});

const work2= new Item({
    name:"code"
});
const work3=new Item({
    name:"repeat"
});

const defaultItem=[work1,work2,work3];

async function insertmany(){

    await Item.insertMany(defaultItem);
    
}

// insertmany();
// Item.insertMany(defaultItem);





// var lists=[];
var Name="";
// var work_list=[];
  
  
app.get("/",function(req,res){


    var today=date();
    async function getdata(){
        const itemlist=await Item.find();

        if(itemlist.length===0){
            Item.insertMany(defaultItem);
            res.redirect("/");
        }
        else {
            res.render('index',{ListTitle:today,item_to_add:itemlist,name:Name});
        }
        console.log(itemlist);
    }
    
    getdata();
    

});

// dynamic routes
app.get("/:customListName" ,function(req,res){

    const customListName=req.params.customListName;

    async function create(){

        const found=await List.findOne({name:customListName});

        const customList=new List({
            name:customListName,
            items:defaultItem
        });
    
        if(!found)customList.save();

        console.log(customListName);
    }
        
    create();

})

app.post("/",function(req,res){
    
    // var item=req.body.item_to_add;
    var checkname=req.body.fname;
    // var checkpage=req.body.list;

    const itemname=req.body.item_to_add;

    const newitem=new Item({
        name:itemname
    });

    if(itemname.length>0){
        newitem.save();
    }
   
    if(checkname.length>0){
        Name=checkname;
    }

    res.redirect("/");
   

    
    // if(checkpage==="work list"){
        
    //     if(item.length>0)work_list.push(item);
    //     res.redirect("/work");
        
    // }
    // else{

        
    //     if(checkname.length>1){
    
    //         Name=checkname;
            
    //     }
    
    //     if(item.length>0)lists.push(item);
        
    //     // console.log(item);
    
    
    //    res.redirect("/");

    // }


});

app.post("/delete",function(req,res){

    const itemtodelete=req.body.checkbox;

    async function del(item){
        
        await Item.findByIdAndRemove(item);
    };

    del(itemtodelete);
    
    console.log(itemtodelete);

    res.redirect("/")
})

app.get("/work",function(req,res){
    
    res.render("index",{ListTitle: "work list",item_to_add:work_list,name:Name});
    
});


app.get("/about",function(req,res){

    res.render("about");

});

app.listen(3000,function(){

    console.log("server is running at port : 3000");

})

