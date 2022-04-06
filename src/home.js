const path = require('path')
const op = require("open")
let ClassObjectArray;
var taskArray = []
localStorage.taskStore ? taskArray = JSON.parse(localStorage.taskStore) : taskArray = [] 

function DisplayTasks(tArr){
    for(var i = 0;i < tArr.length; i++){
        $(".contChildsub").append(`<div class="entry" style="background-color: rgba(0, 0, 0, 0.5);">${tArr[i]}
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
    fs.readFile(path.join(__dirname + "\\jsonFiles\\ClassStorage.json"),(err,jsonString) => 
    {
        if(err){
            console.log(err)
            fs.writeFile(path.join(__dirname + "\\jsonFiles\\ClassStorage.json"),JSON.stringify({Classes : []}, null, 2),err => {
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
            $(this).parent().fadeOut(300)
        })
}
//writes new class to json file 
function WriteToFile(Object){
    fs.writeFile(path.join(__dirname + "\\jsonFiles\\ClassStorage.json"),JSON.stringify(Object, null, 2),err => {
        if(err){console.log(err)}
    })
}
//Add Class Popup HTML String
const AddClassPopupHTMLString = `<div id="popup" class="popup">
<div class="popup-content">
    <span style="cursor: pointer;" class="close"><i class="material-icons">close</i></span>
    <p>Add Class Details</p>
    <form id="form">
        <div class="line">
            <label for="ClassName">Class Name:</label>
            <input type="text" class="inputArea" id="cName">
        </div>
        <div class="line">
            <label for="Time" >Time:</label>
            <input type="time" class="inputArea" id="time">
        </div>
        <div class="line"> 
        <label for="Medium">Medium:</label>
        <input type="text" class="inputArea" id="med">
        </div>
        <div class="line"> 
        <label for="link">Meeting Link:</label>
        <input type="text" class="inputArea" id="form_link" placeholder="must contain 'https://' prefix">
        </div>
    </form>
    <button id="addClass_btn" class="popupBtn">Add</button>
</div> 
</div>`
const AddTaskPopupHTMLString = `<div id="popupB" class="popupB">
<div class="popup-content-B">
    <span style="cursor: pointer;" class="close"><i class="material-icons">close</i></span>
    <p>New Task:</p>
    <textarea id="taskInput"></textarea>
    <button id="addTask_btn" class="popupBtn">Add</button>
</div>
</div>`
$(".btnAddClass").on("click",function(){
    $("#mBody").append(AddClassPopupHTMLString)
    $(".popup").fadeIn(300);
    $(".close").on("click",function(){
        $(".popup").fadeOut(300);
    })
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
        $(".popup").fadeOut(300);
        })
})
$(".btnAddTask").on("click",function(){
    $("#mBody").append(AddTaskPopupHTMLString)
    $(".popupB").fadeIn(300);
    $(".close").on("click",function(){
        $(".popupB").fadeOut(300);
    })
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
        $(".popupB").fadeOut(300);
       }
    })
})
OpenFile();