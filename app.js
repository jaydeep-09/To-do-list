
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

async function insertmany(items){

    await Item.insertMany(items);
    
}

var Name="";

  
  
app.get("/",function(req,res){


    var Today=date();
    async function getdata(){
        const itemlist=await Item.find();

        if(!itemlist){
            // if NULL then insert a default items in Item this only done onece it is started then it will not work
            Item.insertMany(defaultItem);
            res.redirect("/");
        }
        else {
            // if exist then rensder that list
            res.render('index',{ListTitle:"today",item_to_show:itemlist,name:Name});
        }
        
    }
    
    getdata();
    

});

// dynamic routes
app.get("/:customListName" ,function(req,res){

    const customListName=req.params.customListName;

    async function create(customName){


        // before creating any new list first we check it already exis in the database 
        const found=await List.findOne({name:customName});

        if(!found){
            // not found then we create a new list
            const customList=new List({
                name:customName,
                items:defaultItem
            });
        
            customList.save();
            // AFTER SAVING WE RENDER TO THE SAME ROUTE
            res.redirect("/"+customName);

        }
        else {
            // found we render that list
            res.render('index',{ListTitle:found.name,item_to_show:found.items,name:Name});
        }
    } 
        
    create(customListName);

})

app.post("/",function(req,res){
    
   
    var checkname=req.body.fname;
    // this is the name of the user 
    var checkpage=req.body.list;
    // this is the list of the page you are on

    const itemname=req.body.item_to_add;

    if(checkname.length>0){
        // if some of the input are given in the input box
        Name=checkname;
    }

    // here we create a new item 
    const newitem=new Item({
        name:itemname
    });

    // if it belongs to the same routes
    if(checkpage==="today"){
        
        if(itemname.length>0){
            newitem.save();
        }
        
        res.redirect("/");
        // then redirect to same page as things got changes then new changes should be visible by redircting ans then rendering
    }
    else{

        // if it is different list the home ot "/" the updata the list 
        async function check(checkPage){

            // to updata first we find it then update it 
            const foundList=await List.findOne({name:checkPage});

            if(!foundList){
                // if not found then NULL then we redirect to the same routs or pram from where it comes from

                console.log("something wrong in updating curr list items");
                res.redirect("/"+checkPage);

            }
            else{
                // console.log(foundList);
                // if exist then we check it is he new element or not then we push in existing list ans save it 
                // then redirect it to the same route from where it comes from

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

    // to delete a item we got a submit response by oncheck so afer the we callto del function
    const itemtodelete=req.body.checkbox;
    const ListName=req.body.ListName;

    async function del(item,listName){

        if(listName==='today'){

            await Item.findByIdAndRemove(item);
            res.redirect("/");

        }
        else{

            await listName.findByIdAndRemove(item);

            res.redirect("/"+listName);

        }
        
    };

    del(itemtodelete,ListName);
    
    // console.log(itemtodelete);
    
    
})


 
app.get("/about",function(req,res){

    res.render("about");

});

app.listen(3000,function(){

    console.log("server is running at port : 3000");

})

