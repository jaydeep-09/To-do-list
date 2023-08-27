module.exports=function(){
    var data=new Date;

    var options={
        weakend: "long",
        day: "numeric",
        month:"long",
        year:"numeric"
    }
    return data.toLocaleDateString("en-us",options);

}