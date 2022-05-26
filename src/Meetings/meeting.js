const open = require("open");
const { platform } = require("os");
var filePath = path.join(dir + "\\MeetingStorage.json");
var MeetingStorage;

class Meeting{
    constructor(name,date,time,platform,url,repeat){
        this.name = name;
        this.date = date;
        this.time = time;
        this.platform = platform;
        this.url = url;
        this.repeat = repeat;
    }
}

function meetingFile(){
    fs.readFile(filePath,"utf-8",(err,jsonString) => {
        if(err){
            console.error(err)
            fs.writeFile(filePath,JSON.stringify({Meetings:[]}, null, 2),err => {
                if(err){
                    console.log(err)
                }
                meetingFile()
            })
        }else{
            MeetingStorage = JSON.parse(jsonString)
            MeetingStorage.Meetings.forEach((e,i) => {
                $(".meetingList").append(
                    `<div class="Meeting">
                    <div class="meetingInfo">
                        <span>Name:<p id="lblMeetingName">${e.name}</p></span>
                        <span>Platform:<p id="lblMeetingPlatform">${e.platform}</p></span>
                        <span>${e.repeat ? "Reoccurs" : "Date"}:<p id="lblMeetingDate">${typeof e.date == "string" ? e.date : e.date.toString()}</p></span>
                        <span>Time: <p id="lblMeetingTime">@ ${e.time}</p></span>
                    </div>
                    <div class="meetingInfo" id="${i}">
                        <button>Join</button><button><i class="material-icons">more_vert</i></button>
                    </div>
                </div>`)
            });
            $(".meetingInfo").find("button:first-of-type").on("click",function(){
                var id = $(this).parent().attr('id')
                console.log(id)               
                open(MeetingStorage.Meetings[id].url)
            })
            $(".meetingInfo").find("button:last-of-type").on("click",function(){
                var id = $(this).parent().attr('id')
                console.log(id)               
            })
        }
    })
}

function writeToMeetingFile(Obj){
    fs.writeFile(filePath,JSON.stringify(Obj, null, 2),err =>{
        if(err){
            console.log(err)
        }else{
            $(".meetingList").empty();
            meetingFile()
        }
    })
}

meetingFile()
$("#btnCreateMeeting").on('click',function(){
    $(".popup").fadeIn(300)
})
$("#btnAddNewMeeting").on('click',function(){
    var name = $("#meetingName").val()
    var repeat
    if($("#meetingRepeat").is(":checked")){
        repeat = true
        var date = [];
        
        console.log(typeof date)
        $("#meetingRepeatDays").find(":selected").each(function(){
            console.log($(this).text())
            date.push($(this).text())
        })
        if(date.length == 7){
            date = "Everyday"
        }
        console.log(date)
    }else{
        repeat = false
        var date = new Date($("#meetingDate").val())
        date = date.toDateString()
        console.log(new Date(date))
    }
    var time = convert24HourTimeTo12HourTime($("#meetingTime").val())
    var platform = $("#meetingPlatform").find(":selected").text();
    var url = $("#meetingUrl").val()
    var newMeeting = new Meeting(name,date,time,platform,url,repeat)
    MeetingStorage.Meetings.unshift(newMeeting)
    writeToMeetingFile(MeetingStorage)
    $(".popup").fadeOut(300)
    $("#meetingName").val("")
    $("#meetingDate").val("")
    $("#meetingTime").val("")
    $("#meetingPlatform").val("")
    $("#meetingUrl").val("")
})
$(".close").on("click",function(){
    $(".popup").fadeOut(300)
})
window.onclick = function(event){
    if(event.target == $(".popup")[0]){
        $(".popup").fadeOut(300)
    }
}

function deleteMeeting(id){
    MeetingStorage.Meetings.splice(id,1)
    writeToMeetingFile(MeetingStorage)
}
$(".form-group").find("input[type=checkbox]").on("change",function(){
        $(".repeat").toggle(300)
        $(".non-repeat").toggle(300)
})

function dayStringToDateInteger(day){
    switch(day){
        case "Sunday":
            return 0
        case "Monday":
            return 1
        case "Tuesday":
            return 2
        case "Wednesday":
            return 3
        case "Thursday":
            return 4
        case "Friday":
            return 5
        case "Saturday":
            return 6
    }
}
function convert24HourTimeTo12HourTime(time){
    var timeArray = time.split(":")
    var hour = parseInt(timeArray[0])
    var minute = timeArray[1]
    var suffix = "AM"
    if(hour > 12){
        hour -= 12
        suffix = "PM"
    }
    return `${hour}:${minute} ${suffix}`
}

function isDateToday(date){
    var dateNow = new Date()
    return dateNow.getDate() == date.getDate() && dateNow.getMonth() == date.getMonth() && dateNow.getFullYear() == date.getFullYear()
}