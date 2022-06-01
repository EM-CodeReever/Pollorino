var filePath = path.join(dir + "\\EventStorage.json");
var EventStorage;
var Configuration;
Configuration = JSON.parse(sessionStorage.Config)

function twoDigit(x){
    var output
    if(x < 10){
        output = "0"+x
        return output
    }else if(x == 0){
        return x
    }else{
        return x
    }
}

function milliSecondsConverter(millis){
    var con_secs = (millis/1000);
    var con_secs_rounded = Math.round(con_secs);
    var con_mins = 0;
    var con_hrs = 0;
    var con_days = 0;
    var con_weeks = 0;
    
    while(con_secs_rounded >= 60){
        con_secs_rounded -= 60;
        con_mins++;
    }
    while(con_mins >= 60){
        con_mins -= 60
        con_hrs++;
    }
    while(con_hrs >= 24){
        con_hrs -= 24;
        con_days++;
    }
    while(con_days >= 7){
        con_days -= 7;
        con_weeks++;
    }
    return {
        "weeks": con_weeks,
        "days": con_days,
        "hrs": con_hrs,
        "mins": con_mins,
        "secs": con_secs_rounded
    }
}

class EventObject{
    constructor(name,date,type,status,memo){
        this.name = name
        this.date = date
        this.dateString = date.toDateString()
        this.type = type
        this.status = status
        this.memo = memo
    }
}

function eventFile(){
    fs.readFile(filePath,"utf-8",(err,jsonString) => {
        if(err){
            console.error(err)
            fs.writeFile(filePath,JSON.stringify({Events:[]}, null, 2),err => {
                if(err){
                    console.log(err)
                }
                eventFile()
            })
        }else{
            EventStorage = JSON.parse(jsonString)
            EventStorage.Events.forEach((e,i) => {
                $(".eventWrap").append(`<div class="eventCard" ${Configuration.Settings.EventMarkerVisible ? "style=\"border-bottom: 3px solid " + eventTypeColor(e.type) + "\"": ""} id="${i}">
                        <h2 id="eventName">${e.name}</h2>
                        <h2><span>Date:</span><span>${e.dateString}</span></h2>
                        <h2><span>Type:</span><span>${e.type}</span></h2>
                        <h2><span>Status:</span><span id="status">${e.status}</span></h2>
                        <h2>Memo:</h2>
                        <div id="memoBox">${e.memo}</div>
                        <button class="deleteEvent">Delete</button>
                    </div>`)
            });
            
            attachEvents()
            countDownTimer()
        }
    })
}

eventFile()

function writeToEventFile(Obj){
    fs.writeFile(filePath,JSON.stringify(Obj, null, 2),err =>{
        if(err){
            console.log(err)
        }else{
           $(".eventWrap").empty()
           eventFile()
        }
    })
}

$("#addEvent").on("click",function(){
    $(".popup").fadeIn(300)
})
$(".close").on("click",function(){
    $(".popup").fadeOut(300)
    clearModal()
})
window.onclick = function(event){
    if(event.target == $(".popup")[0]){
        $(".popup").fadeOut(300)
        clearModal()
    }
}
function clearModal(){
    $("#event_Name").val("")
    $("#eventDate").val("")
    $("#event_type").val("")
    $("#eventMemo").val("")
}
$("#addEventBtn").on("click",function(){
    var name = $("#event_Name").val()
    var date = new Date($("#eventDate").val())
    var type = $("#event_type :selected").text()
    var memo = $("#eventMemo").val()
    var status = "Upcoming"
    var newEvent = new EventObject(name,date,type,status,memo)
    EventStorage.Events.unshift(newEvent)
    writeToEventFile(EventStorage)
    $(".popup").fadeOut(300)
    clearModal()
})
function attachEvents(){
    $(".deleteEvent").off('click')
    $(".deleteEvent").on("click",function(){
        var index = $(this).parent().attr("id")
        EventStorage.Events.splice(index,1)
        $(this).parent().fadeOut(300,function(){
            writeToEventFile(EventStorage)
        })
    })
}

function timeUntilEvent(event){
    var now = new Date()
    var eventDate = new Date(event.date)
    var diff = eventDate - now
    return diff
}

function countDownTimer(){
    var lowest = -99;
    var nextEventName;
    EventStorage.Events.forEach((e,i) => {
        if(e.status != "Completed" && timeUntilEvent(e) > 0){
            if(lowest == -99){
                lowest = timeUntilEvent(e)
                nextEventName = e.name
           }else if(timeUntilEvent(e) < lowest){
                lowest = timeUntilEvent(e)
                nextEventName = e.name
            }else if(timeUntilEvent(e) < 0){
                e.status = "Completed"
                writeToEventFile(EventStorage)
            }
        }else{
            e.status = "Completed"
            $(`#${i}`).find("#status").text(e.status)
            $(`#${i}`).find("#status").addClass("completed")
        }
    })
    if(lowest >= 0){
        $(".wrapper").show()
        $("#noEvent").hide()
        var time = milliSecondsConverter(lowest)
        $("#nextEventName").text(nextEventName)
        $("#weeks").text(twoDigit(time.weeks))
        $("#days").text(twoDigit(time.days))
        $("#hours").text(twoDigit(time.hrs))
        $("#minutes").text(twoDigit(time.mins))
        $("#seconds").text(twoDigit(time.secs))
    }
    if(EventStorage.Events.length == 0 || lowest == -99){
        $(".wrapper").fadeOut(300,function(){$("#noEvent").fadeIn(300)})
    }
}

setInterval(countDownTimer,1000)


function eventTypeColor(type){
    switch(type){
        case "Assignment":
            return "#df4759"
        case "Deadline":
            return "#467fd0"
        case "Custom":
            return "#42ba96"
        case "Special Occasion":
            return "#ffc107"
    }
}