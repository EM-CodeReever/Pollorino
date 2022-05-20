const op = require("open")
let ClassObjectArray;
var taskArray = []

localStorage.taskStore ? taskArray = JSON.parse(localStorage.taskStore) : taskArray = [] 

//Renders all task to the Homepage
function DisplayTasks(tArr){
    for(var i = 0;i < tArr.length; i++){
        $(".contChildsub").append(`<div class="entry">${tArr[i]}
        <div class="entryBtn" id="${i}">
            <span class="taskBin">
                <i class="material-icons">delete</i>
            </span>
        </div>
    </div>`)
    }
    $(".entryBtn").on("click",function(){
        $(this).parent().fadeOut(300)
        taskArray.splice($(this).attr("id"),1)
        localStorage.setItem('taskStore',JSON.stringify(taskArray))
    })
}
DisplayTasks(taskArray);

//Opens Json file (creates it if it doesnt exist)
function OpenFile()
{
    fs.readFile(path.join(dir + "\\ClassStorage.json"),(err,jsonString) => 
    {
        if(err){
            console.log(err)
            fs.writeFile(path.join(dir + "\\ClassStorage.json"),JSON.stringify({Classes : []}, null, 2),err => {
                if(err){
                    console.log(err)
                }else{OpenFile()}
            }) 
        }else{
            ClassObjectArray = JSON.parse(jsonString)
            DisplayClasses(ClassObjectArray);
        }
    })
}

//Displays classes with data from json file
function DisplayClasses(ClassObjectArray)
{
    for(var i = 0; i < ClassObjectArray.Classes.length;i++)
    {
        const ClassControlHTMLString = `<div class="tile">
                                    <button class="tile_btn"><a href="${ClassObjectArray.Classes[i].Link}" target="_blank" class="link_off" onclick="return false">Join</a></button>
                                    <button class="del_btn" id="${i}">Delete</button>
                                    <h3>Class: ${ClassObjectArray.Classes[i].Name}</h3>
                                    <h3>Time: ${ClassObjectArray.Classes[i].Time}</h3>
                                    <h3>Medium: ${ClassObjectArray.Classes[i].Medium}</h3>
                                </div>`
        $(".containerB").append(ClassControlHTMLString)
    }
    $(".tile_btn").on("click",function(){
        op($(this).find("a").attr("href"))
    })
    $(".del_btn").on("click",function(){
        ClassObjectArray.Classes.splice($(this).attr("id"),1)
        WriteToFile(ClassObjectArray)
        $(this).parent().fadeOut(300)
    })
}

//appends a newly added class to the Document as well as refreshes events
function UpdateDisplayClasses(ClassObjectArray)
{
    var i = ClassObjectArray.Classes.length - 1;
        const s = `<div class="tile">
                                    <button class="tile_btn"><a href="${ClassObjectArray.Classes[i].Link}" target="_blank" class="link_off" onclick="return false">Join</a></button>
                                    <button class="del_btn" id="${i}">Delete</button>
                                    <h3>Class: ${ClassObjectArray.Classes[i].Name}</h3>
                                    <h3>Time: ${ClassObjectArray.Classes[i].Time}</h3>
                                    <h3>Medium: ${ClassObjectArray.Classes[i].Medium}</h3>
                                </div>`
        $(".containerB").append(s)

        $(".tile_btn").off("click")
        $(".tile_btn").on("click",function(){
            op($(this).find("a").attr("href"))
        })
        $(".del_btn").off("click")
        $(".del_btn").on("click",function(){
            ClassObjectArray.Classes.splice($(this).attr("id"),1)
            WriteToFile(ClassObjectArray)
        })
}

//writes new class to json file 
function WriteToFile(Object){
    fs.writeFile(path.join(dir + "\\ClassStorage.json"),JSON.stringify(Object, null, 2),err => {
        if(err){console.log(err)}
    })
}

//Adds click events to add and close buttons for all popups
$(".btnAddClass").on("click",function(){
    $(".AddClassModal").fadeIn(300);
    $(".close").on("click",function(){
        $(".AddClassModal").fadeOut(300);
    })
})

$(".btnAddTask").on("click",function(){
    $(".AddTaskModal").fadeIn(300);
    $(".close").on("click",function(){
        $(".AddTaskModal").fadeOut(300);
    })
})
$(".btnDeleteAll").on("click",function(){
    $(".DeleteAllModal").fadeIn(300);
    $(".close").on("click",function(){
        $(".DeleteAllModal").fadeOut(300);
    })
})

OpenFile();

//click event for a new task to be created, appends a newly added task to the Document as well as refreshes events
$("#addTask_btn").on("click",function(){
    var task = $("#taskInput").val()
    if(task != ""){
    taskArray.push(task)
    localStorage.setItem('taskStore',JSON.stringify(taskArray))
    
    $(".contChildsub").append(`<div class="entry" style="background-color: rgba(0, 0, 0, 0.5);">${task}
    <div class="entryBtn" id="${taskArray.length-1}">
        <span class="taskBin">
            <i class="material-icons">delete</i>
        </span>
    </div>
</div>`)
    $(".entryBtn").off("click")
    $(".entryBtn").on("click",function(){
        $(this).parent().fadeOut(300)
        taskArray.splice($(this).attr("id"),1)
        localStorage.setItem('taskStore',JSON.stringify(taskArray))
    })
    $(".AddTaskModal").fadeOut(300);
   }
})

//click event for submitting data for a new class to be created
$("#addClass_btn").on("click",function(){
    let cName = $('#cName').val()
    let med = $('#med').val()
    var time = $('#time').val()
    var mLink = $('#form_link').val()
    if(cName != "" && med != "" && time != "" && mLink != ""){
        ClassObjectArray.Classes.push({
            Name : cName,
            Time : time,
            Medium : med,
            Link : mLink
        })
        WriteToFile(ClassObjectArray)
        UpdateDisplayClasses(ClassObjectArray)
    }
    $(".AddClassModal").fadeOut(300);
})

// click event for the DeleteAllModal 'delete button'
$("#remove_btn").on("click",function(){
    if($("#clearClassVal").prop("checked") && $("#clearTaskVal").prop("checked")){
        WriteToFile({Classes : []})
        localStorage.removeItem('taskStore')
        $(".entry").fadeOut(300);
        $(".tile").fadeOut(300);
    }else if($("#clearClassVal").prop("checked")){
        WriteToFile({Classes : []})
        $(".tile").fadeOut(300);
    }else if($("#clearTaskVal").prop("checked")){
        localStorage.removeItem('taskStore')
        $(".entry").fadeOut(300);
    }
    $(".DeleteAllModal").fadeOut(300)
})