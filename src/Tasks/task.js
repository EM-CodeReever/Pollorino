var filePath = path.join(dir + "\\TaskStorage.json");
let { Tasks } = require(filePath)
function taskFile(){
    Tasks.forEach((e,i) => {
        $(".taskList").append(
            `<div class="task" id="${i}">
            <div><i class="material-icons ${e.Priority}">circle</i></div>
            <p>${e.Text}</p>
            <span><i class="material-icons maticn" style="font-size: 30px;">done</i></span>
        </div>`)
    });
    if(Tasks.length == 0){
        $(".taskList").append(`<p class="no-tasks">No Tasks</p>`)
    }else{
        $(".taskList").find(".no-tasks").remove()
    }
    attachClickEvents()            
}
    
taskFile()
$("#btnNewTask").on('click',function(){
    if($("#txtNewTask").val() != ""){
        console.log($("#txtNewTask").val())
        var text  = $("#txtNewTask").val()
        var prio;
        $(".taskPriority").find("input").each(function(){
            if($(this).is(":checked")){prio = $(this).siblings("label").html()}
        })
        Tasks.unshift({Text:text,Priority:prio})
        WriteToTaskFile(Tasks)
        $(".taskList").empty();
        taskFile()
        $("#txtNewTask").val("")
        $(".taskSort").find("span:nth-of-type(4)").find(":radio").prop("checked", true)
    }
})

async function WriteToTaskFile(Obj){
    await fs.writeFile(filePath,JSON.stringify({"Tasks":Obj}, null, 2),err =>{
        if(err){
            console.log(err)
        }
    })
}

$(".taskPriority").find("span").on("click",function(){
    $(this).find(":radio").prop("checked", true)
})

$(".taskSort").find("span").on("click",function(){
    $(this).find(":radio").prop("checked", true)
})

$(".taskSort").find("span:nth-of-type(1)").on("click",function(){
    $(".task").each(function(){
        if($(this).find("i:first-of-type").hasClass("High")){
            $(this).show()
        }else{
            $(this).hide()
        }
    })
})
$(".taskSort").find("span:nth-of-type(2)").on("click",function(){
    $(".task").each(function(){
        if($(this).find("i:first-of-type").hasClass("Medium")){
            $(this).show()
        }else{
            $(this).hide()
        }
    })
})
$(".taskSort").find("span:nth-of-type(3)").on("click",function(){
    $(".task").each(function(){
        if($(this).find("i:first-of-type").hasClass("Low")){
            $(this).show()
        }else{
            $(this).hide()
        }
    })
})
$(".taskSort").find("span:nth-of-type(4)").on("click",function(){
    $(".taskList").empty();
    taskFile()
})

function attachClickEvents(){
    $(".task").find("span").off("click")
    $(".task").find("span").on("click",function(){
        var id = $(this).parent().attr('id')
        Tasks.splice(id,1)
        WriteToTaskFile(Tasks)
        $(this).parent().fadeOut(300,function(){
            $(".taskList").empty();
            taskFile()
        })
    })
}
