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
            TaskStorage.Tasks.forEach((e,i) => {
                $(".taskList").append(
                    `<div class="task" id="${i}">
                    <div><i class="material-icons ${e.Priority}">circle</i></div>
                    <p>${e.Text}</p>
                    <span><i class="material-icons maticn" style="font-size: 30px;">done</i></span>
                </div>`)
            });
            $(".task").find("span").on("click",function(){
                var id = $(this).parent().attr('id')
                console.log(id)
                $(this).parent().fadeOut(300,function(){
                    TaskStorage.Tasks.splice(id,1)
                    WriteToTaskFile(TaskStorage)
                })
                
            })
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
    $("#txtNewTask").val("")
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
