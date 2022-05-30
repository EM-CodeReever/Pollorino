var meetingfilePath = path.join(dir + "\\MeetingStorage.json");
var taskfilePath = path.join(dir + "\\TaskStorage.json");
var toggle = true;
function greeting() {
    var time = new Date().getHours();
    var message;
    if (time < 12) {
        message = "Good Morning";
    } else if (time < 18) {
        message = "Good Afternoon";
    } else {
        message = "Good Evening";
    }
    return message;
}
$("#greeting-text").text(greeting());

$(".btnDropdown").on('click', function () {
    if(!$(this).hasClass("expanded")){
        var itemCount = $(this).parent().next().children().length
        var totalMargin = (itemCount - 1) * 5;
        var totalItemHeight = itemCount * 40;
        var totalHeight = totalItemHeight + totalMargin + 60;
        $(this).addClass("expanded")
        $(this).find("i").css("transform","rotate(180deg)")
        $(this).parent().parent().animate({height: `${totalHeight}px`}, 300);
        console.log();
    }else{
        $(this).find("i").removeClass("rotate")
        $(this).find("i").css("transform","rotate(0deg)")
        $(this).removeClass("expanded")
        $(this).parent().parent().animate({height: '50px'}, 300);
    }
});

class EventClass 
{
    constructor(name,type,memo,rawDate){
        this.rawDate = new Date(rawDate);
        this.name = name;
        this.type = type;
        this.memo = memo;
        this.status = "Upcoming";
    }
}

function meetingFile(){
    fs.readFile(meetingfilePath,"utf-8",(err,jsonString) => {
        if(err){
            console.error(err)
            fs.writeFile(meetingfilePath,JSON.stringify({Meetings:[]}, null, 2),err => {
                if(err){
                    console.log(err)
                }
                meetingFile()
            })
        }else{
            var MeetingStorage = JSON.parse(jsonString)
            var meetingsToday = 0;
            MeetingStorage.Meetings.forEach(meeting => {
                if(!meeting.repeat){
                    var date = new Date(meeting.date)
                    if(isDateToday(date)){
                        meetingsToday++
                        $(".dashboard-meeting-body").append(`<div class="item">${meeting.name} <p class="time-badge">@${meeting.time}</p></div>`)
                    }
                }else{
                    var reoccuringToday = false;
                    for(var x = 0; x < meeting.date.length; x++){
                        if(isToday(meeting.date[x])){
                            reoccuringToday = true;
                        }
                    }
                    if(reoccuringToday){
                        meetingsToday++
                        $(".dashboard-meeting-body").append(`<div class="item"><div>${meeting.name}</div> <p class="time-badge">@${meeting.time}</p></div>`)
                    }
                }
            })
            $(".dashboard-meeting-header").find(".item-number").text(meetingsToday)
            
        }   
    })
}
function taskFile(){
    fs.readFile(taskfilePath,"utf-8",(err,jsonString) => {
        if(err){
            console.error(err)
            fs.writeFile(taskfilePath,JSON.stringify({Tasks:[]}, null, 2),err => {
                if(err){
                    console.log(err)
                }
                taskFile()
            })
        }else{
            TaskStorage = JSON.parse(jsonString)
            var urgentTasks = 0;
            TaskStorage.Tasks.forEach((e,i) => {
                if(e.Priority == "High"){
                   urgentTasks++
                    $(".dashboard-task-body").append(`<div class="item">${e.Text}</div>`)
                }
            });
            $(".dashboard-task-header").find(".item-number").text(urgentTasks)
        }
    })
}

eventContentArray = localStorage.eventContentArrayStorage ? JSON.parse(localStorage.eventContentArrayStorage) : [];
var eventArray = []
var eventsToday = 0;
for(x=0;x<eventContentArray.length;x++)
{
    eventArray.push(new EventClass(eventContentArray[x][0],eventContentArray[x][1],eventContentArray[x][2],eventContentArray[x][3]))
}

eventArray.forEach(e => {
    if(isDateToday(e.rawDate)){
        eventsToday++
        $(".dashboard-event-body").append(`<div class="item">${e.name}</div>`)
    }
})
$(".dashboard-event-header").find(".item-number").text(eventsToday)
taskFile()
meetingFile()

function isDateToday(date){
    var dateNow = new Date()
    return dateNow.getDate() == date.getDate() && dateNow.getMonth() == date.getMonth() && dateNow.getFullYear() == date.getFullYear()
}
function isToday(day){
    var dayArray = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]
    var dayIndex = dayArray.indexOf(day)
    if(day == "Everyday"){
        return true
    }
    if(dayIndex == -1){
        return false
    }else{
        var date = new Date()
        var dayIndexToday = date.getDay()
        if(dayIndex == dayIndexToday){
            return true
        }else{
            return false
        }
    }
}
