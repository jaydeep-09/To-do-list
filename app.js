
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
        console.log("mongodb connection is successfull.......");
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

var Name="";

  
  
app.get("/",function(req,res){


    var Today=date();
    async function getdata(){
        const itemlist=await Item.find();

        if(!itemlist){
            // if NULL
            Item.insertMany(defaultItem);
            res.redirect("/");
        }
        else {
            // if exist
            res.render('index',{ListTitle:"today",item_to_show:itemlist,name:Name});
        }
        // console.log(itemlist);
    }
    
    getdata();
    

});

// dynamic routes
app.get("/:customListName" ,function(req,res){

    const customListName=req.params.customListName;

    async function create(customName){

        const found=await List.findOne({name:customName});

        if(!found){
            // not found
            const customList=new List({
                name:customName,
                items:defaultItem
            });
        
            customList.save();

            res.redirect("/"+customName);
            
            // console.log(found);
        }
        else {
            // found
            res.render('index',{ListTitle:found.name,item_to_show:found.items,name:Name});
        }
    } 
        
    create(customListName);

})

app.post("/",function(req,res){
    
   
    var checkname=req.body.fname;
    var checkpage=req.body.list;

    const itemname=req.body.item_to_add;

    if(checkname.length>0){
        Name=checkname;
    }

    const newitem=new Item({
        name:itemname
    });

    if(checkpage==="today"){
        
        if(itemname.length>0){
            newitem.save();
        }
        
        res.redirect("/");
    }
    else{

        async function check(checkPage){

            const foundList=await List.findOne({name:checkPage});

            if(!foundList){
                console.log("something wrong in updating curr list items");
                res.redirect("/"+checkPage);
            }
            else{
                // console.log(foundList);
                if(itemname.length>0){
    
                    foundList.items.push(newitem);
    
                    foundList.save();
                }
    
                res.redirect("/"+checkPage);
            }

        }

        check(checkpage);

       
    }

});

app.post("/delete",function(req,res){

    const itemtodelete=req.body.checkbox;

    async function del(item){
        
        await Item.findByIdAndRemove(item);
    };

    del(itemtodelete);
    
    // console.log(itemtodelete);
    res.redirect("/")
})


 
app.get("/about",function(req,res){

    res.render("about");

});

app.listen(3000,function(){

    console.log("server is running at port : 3000");

})

