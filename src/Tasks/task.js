var filePath = path.join(dir + "\\TaskStorage.json");
var TaskStorage;

function taskFile(){
    fs.readFile(filePath,"utf-8",(err,jsonString) => {
        if(err){
            console.error(err)
            fs.writeFile(filePath,JSON.stringify({Tasks:[]}, null, 2),err => {
                if(err){
                    console.log(err)
                }
                taskFile()
            })
        }else{
            TaskStorage = JSON.parse(jsonString)
            TaskStorage.Tasks.forEach(e => {
                $(".taskList").append(
                    `<div class="task">
                    <div><i class="material-icons ${e.Priority}">circle</i></div>
                    <p>${e.Text}</p>
                    <span><i class="material-icons maticn" style="font-size: 30px;">done</i></span>
                </div>`)
            });
        }
    })
}
taskFile()
$("#btnNewTask").on('click',function(){
    var text  = $("#txtNewTask").val()
    var prio;
    $(".taskPriority").find("input").each(function(){
        if($(this).is(":checked")){prio = $(this).siblings("label").html()}
    })
    TaskStorage.Tasks.unshift({Text:text,Priority:prio})
    WriteToTaskFile(TaskStorage)
})

function WriteToTaskFile(Obj){
    fs.writeFile(filePath,JSON.stringify(Obj, null, 2),err =>{
        if(err){
            console.log(err)
        }else{
            $(".taskList").empty();
            taskFile()
        }
    })
}
// var ttt = []
// ttt.unshift

// $(":checkbox").each(function(){
//     if($(this).is(":checked")){sel++}
// })