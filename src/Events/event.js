var eventArray = []
var eventContentArray = []
var countDownArray = []
month_string_arr = ["January","February","March","April","May","June","July","August","September","October","November","December"]
var typeName = ["Assignment","Deadline","Special Occasion","Custom"]
var typeColor = ["green","#7B22A8","#FF8000","#1DB5B8"]

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
function dateConverter(rawDate){
    var output;
    var mer = "AM"
    var hrs = rawDate.getHours();
    if(rawDate.getHours() > 12){
        mer = "PM"
        hrs = rawDate.getHours() - 12
    }else if(rawDate.getHours() == 12){
        mer = "PM"
    }else if(rawDate.getHours() == 0){
        hrs = 12
    }
    
    output = month_string_arr[rawDate.getMonth()] + " " + rawDate.getDate() + ", " + rawDate.getFullYear() + " " + twoDigit(hrs) + ":" + twoDigit(rawDate.getMinutes()) +" "+ mer
    return output
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
    return [con_weeks,con_days,con_hrs,con_mins,con_secs_rounded];
}
function indexInClass(node,class_name)
{
    var entryNodeList = document.getElementsByClassName(class_name)
    var num = 0;
    for (var i = 0; i < entryNodeList.length; i++) {
      if (entryNodeList[i] === node) {
        return num;
      }
      num++;
    }
    return -1;
}
class EventClass 
{
    constructor(name,type,memo,rawDate){
        this.rawDate = new Date(rawDate);
        this.name = name;
        this.date = dateConverter(this.rawDate);
        this.type = type;
        this.memo = memo;
        this.status = "Upcoming";
    }
    createEventCard = () => {
        var eventMarker;
        if(JSON.parse(localStorage.eventMarkerVisible)){
            for(var x = 0; x < typeName.length; x++){
                if(this.type == typeName[x]){
                eventMarker = `5px solid ${typeColor[x]}`;
                }
            }
        }else{eventMarker = 'none'}
        var eventContent = `<div class="eventCard" style="border-bottom: ${eventMarker}"><h2 id="eventName">${this.name}</h2>
        <h2><span>Date:</span><span>${this.date}</span></h2>
        <h2><span>Type:</span><span>${this.type}</span></h2>
        <h2><span>Status:</span><span id="status">${this.status}</span></h2>
        <h2>Memo:</h2>
        <div id="memoBox">${this.memo}</div>
        <button class="deleteEvent">Delete</button>
        </div>`
        $(".eventWrap").append(eventContent)
    }
}

(localStorage.eventContentArrayStorage) ? eventContentArray = JSON.parse(localStorage.eventContentArrayStorage) : eventContentArray = [];


for(x=0;x<eventContentArray.length;x++)
{
    eventArray.push(new EventClass(eventContentArray[x][0],eventContentArray[x][1],eventContentArray[x][2],eventContentArray[x][3]))
    eventArray[x].createEventCard()
}

function showPopUp(){
    $(".popup").fadeIn("fast")
}
window.onclick = (event) => {
    if (event.target == popup) {
        $(".popup").fadeOut("fast")
        clearModal()
    }
}
$(".close").on("click",function(){
    $(".popup").fadeOut("fast")
    clearModal()
})

$("#addEventBtn").on("click",function(){
    if($("#event_Name").val() != "" && document.getElementById("eventDate").value != "" && $("#event_type").val() != null){
    var name = $("#event_Name").val()
    var type = $("#event_type :selected").text()
    var date = new Date(document.getElementById("eventDate").value)
    var memo = document.getElementById("eventMemo").value
    eventContentArray.push([name,type,memo,date])
    eventArray.push(new EventClass(name,type,memo,date))
    localStorage.setItem("eventContentArrayStorage",JSON.stringify(eventContentArray))
    eventArray[eventArray.length - 1].createEventCard()
    $(".popup").fadeOut("fast")
    clearModal()
    $('.deleteEvent').off('click')
    deleteEvent();
    }else{
        $("#errorMsg").text("Please fill in all required fields")
        $("#errorMsg").fadeIn("fast")
        setTimeout(function(){$("#errorMsg").fadeOut(300)},2000)
    }
})
function deleteEvent(){
$(".deleteEvent").on("click",function(){
    var num = indexInClass(this,"deleteEvent")
    eventContentArray.splice(num,1)
    eventArray.splice(num,1)
    localStorage.setItem('eventContentArrayStorage',JSON.stringify(eventContentArray))
    num++
    $.when($(`.eventCard:nth-child(${num})`).fadeOut("slow")).then(function(){$(`.eventCard:nth-child(${num})`).remove()})
    $('.deleteEvent').off('click')
    deleteEvent();
})
}
function timeCountDown(){
    var CurrentDate = new Date();
    var timeLeftForEvent;
    var lowestTimeLeftForEvent = 0;
    var upcomingEventName;
    for(var x = 0;x < eventArray.length; x++){
        timeLeftForEvent = (eventArray[x].rawDate - CurrentDate);
        if(lowestTimeLeftForEvent == 0 && timeLeftForEvent > 0){
            lowestTimeLeftForEvent = timeLeftForEvent
            upcomingEventName = eventContentArray[x][0]
        }else if(timeLeftForEvent < 0 && eventArray.length == 0){
            $(".wrapper").fadeOut("fast","linear",function(){$("#noEvent").fadeIn("fast")})
        }else if(timeLeftForEvent < 0){
            if($(`.eventCard:nth-child(${x+1})`).attr("id") != "expired"){
                $(`.eventCard:nth-child(${x+1})`).find("h2:nth-child(4)").find("span:nth-child(2)").css("color","#d63529")
                $(`.eventCard:nth-child(${x+1})`).attr("id","expired")
                eventArray[x].status = "Date Passed"
                localStorage.setItem('eventContentArrayStorage',JSON.stringify(eventContentArray))  
                $(`.eventCard:nth-child(${x+1})`).find("h2:nth-child(4)").find("span:nth-child(2)").html(eventArray[x].status)
                $(`.eventCard:nth-child(${x+1})`).find("h2:nth-child(4)").find("span:nth-child(2)").css("font-style","italic")
                
            }
        }else{
            if(lowestTimeLeftForEvent > timeLeftForEvent && timeLeftForEvent > 0){
                lowestTimeLeftForEvent = timeLeftForEvent
                upcomingEventName = eventContentArray[x][0]
            } 
        }
    }
    if((eventArray.length != 0 && timeLeftForEvent > 0) || (eventArray.length != 0 && lowestTimeLeftForEvent > 0)){

             $(".wrapper").show().children().show()
             $("#noEvent").hide()

        countDownArray = milliSecondsConverter(lowestTimeLeftForEvent)
        
        $("#nextEventName").html(upcomingEventName)
        $("#weeks").html(twoDigit(countDownArray[0]))
        $("#days").html(twoDigit(countDownArray[1]))
        $("#hours").html(twoDigit(countDownArray[2]))
        $("#minutes").html(twoDigit(countDownArray[3]))
        $("#seconds").html(twoDigit(countDownArray[4]))
    }else{
        $(".wrapper").fadeOut(200,"linear",function(){$("#noEvent").show()})
    }
}
deleteEvent()
timeCountDown()
setInterval(timeCountDown,1000)

function clearModal(){
    $("#event_Name").val("")
    $("#eventDate").val("")
    $("#event_type").val("")
    $("#eventMemo").val("")
}