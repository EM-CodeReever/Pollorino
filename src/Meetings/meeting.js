const open = require("open");
var filePath = path.join(dir + "\\MeetingStorage.json");
const tippy = require('tippy.js').default;
let { Meetings } = require(filePath)

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
//check an array of sday strings andd returnsa shortened version of the days
function getShortenedDays(days){
    var shortenedDays = [];
    days.forEach((day) => {
        switch(day){
            case "Monday":
                shortenedDays.push("Mon");
                break;
            case "Tuesday":
                shortenedDays.push("Tue");
                break;
            case "Wednesday":
                shortenedDays.push("Wed");
                break;
            case "Thursday":
                shortenedDays.push("Thu");
                break;
            case "Friday":
                shortenedDays.push("Fri");
                break;
            case "Saturday":    
                shortenedDays.push("Sat");
                break;
            case "Sunday":
                shortenedDays.push("Sun");
                break;
        }   
    })
    return shortenedDays.join(", ")
}

function meetingFile(){
    Meetings.forEach((e,i) => {
        $(".meetingList").append(
            `<div class="Meeting">
            <div class="meetingInfo">
                <span>Name:<p id="lblMeetingName">${e.name}</p></span>
                <span>Platform:<p id="lblMeetingPlatform">${e.platform}</p></span>
                <span>${e.repeat ? "Reoccurs" : "Date"}:<p id="lblMeetingDate">${displayDateStringArray(e)}</p></span>
                <span>Time: <p id="lblMeetingTime">@ ${e.time}</p></span>
            </div>
            <div class="meetingInfo" id="${i}">
                <button>Join</button><button class="options"><i class="material-icons">more_vert</i></button>
            </div>
        </div>`)
    });
    if(Meetings.length == 0){
        $(".meetingList").append(`<p class="no-meetings">No Meetings</p>`)
    }else{
        $(".meetingList").find(".no-meetings").remove()
    }
    tippy('.options',{
        placement: "left",
        allowHTML: true,
        trigger: "mouseenter",
        interactive: true,
        onShown: function(){
            $(".meetingTooltip").find("button").on("click",function(){
                var Id = Number(sessionStorage.getItem("meetingId"))
                if($(this).html() == "Delete"){
                    deleteMeeting(Id)
                }else{
                    $("#btnAddNewMeeting").hide()
                    $("#btnSaveMeeting").show()
                    $(".popup").fadeIn(300)
                    $("#meetingName").val(Meetings[Id].name)
                    if(Meetings[Id].repeat){
                        $("#meetingRepeat").prop("checked",false)
                        $("#meetingRepeat").trigger("click")
                        //check if text is equal to selected options and if it is set the option to selected
                        for(var i = 0; i < Meetings[Id].date.length; i++){
                            $("#meetingRepeatDays").find("option").each(function(index){
                                if($(this).text() == Meetings[Id].date[i]){
                                    $(this).attr("selected","selected")
                                }
                            })
                        }
                    }else{
                        $("#meetingRepeat").prop("checked",false)
                        var formattedDate = dateObjectToDateFormat(Meetings[Id].date, Meetings[Id].time)
                        $("#meetingDate").val(formattedDate)
                    }
                    $("#meetingTime").val(convert12HourTimeTo24HourTime(Meetings[Id].time))
                    $("#meetingPlatform").find("option").each(function(){
                        if($(this).text() == Meetings[Id].platform){
                            $(this).attr("selected","selected")
                        }
                    })
                    $("#meetingUrl").val(Meetings[Id].url)
                }
            })
        },
        onHide: function(){
            $(".meetingTooltip").find("button").off("click")
        },
        duration: 200,
        content: `<div class="meetingTooltip">
        <button>Delete</button>
        <button>Edit</button>
        </div>`,
    })
    
    attachClickEvents()           
}
function writeToMeetingFile(Obj){
    fs.writeFile(filePath,JSON.stringify({"Meetings":Obj}, null, 2),err =>{
        if(err){
            console.log(err)
        }else{
           $(".meetingList").empty()
              meetingFile()
        }
    })
}

meetingFile()
$("#btnCreateMeeting").on('click',function(){
    $(".popup").fadeIn(300)
    $("#btnAddNewMeeting").show()
    $("#btnSaveMeeting").hide()
})
$("#btnAddNewMeeting").on('click',function(){

    if(modalValidation()){
        var name = $("#meetingName").val()
        var repeat
        if($("#meetingRepeat").is(":checked")){
            repeat = true
            var date = [];
            $("#meetingRepeatDays").find(":selected").each(function(){
                date.push($(this).text())
            })
            var time = convert24HourTimeTo12HourTime($("#meetingTime").val())
        }else{
            repeat = false
            var date = new Date($("#meetingDate").val())
            var time = convert24HourTimeTo12HourTime(date.toTimeString())
            console.log(date.toTimeString());
            console.log(time);
            date = date.toDateString()

        }
        var platform = $("#meetingPlatform").find(":selected").text();
        var url = $("#meetingUrl").val()
        var newMeeting = new Meeting(name,date,time,platform,url,repeat)
        Meetings.unshift(newMeeting)
        writeToMeetingFile(Meetings)
        $(".popup").fadeOut(300)
        setTimeout(function(){
            clearPopup()
        },300)
    }else{
        $("#errorMsg").text("Please fill in all required fields")
        $("#errorMsg").fadeIn("fast")
        setTimeout(function(){$("#errorMsg").fadeOut(300)},2000)
    }
})

$("#btnSaveMeeting").on('click',function(){
    if(modalValidation()){
        var Id = Number(sessionStorage.getItem("meetingId"))
        var name = $("#meetingName").val()
        var repeat
        if($("#meetingRepeat").is(":checked")){
            repeat = true
            var date = [];
            $("#meetingRepeatDays").find(":selected").each(function(){
                date.push($(this).text())
            })
            var time = convert24HourTimeTo12HourTime($("#meetingTime").val())
        }else{
            repeat = false
            var date = new Date($("#meetingDate").val())
            var time = convert24HourTimeTo12HourTime(date.toTimeString())
            console.log(date.toTimeString());
            console.log(time);
            date = date.toDateString()    
        }
        var platform = $("#meetingPlatform").find(":selected").text();
        var url = $("#meetingUrl").val()
        var newMeeting = new Meeting(name,date,time,platform,url,repeat)
        Meetings[Id] = newMeeting
        writeToMeetingFile(Meetings)
        $(".popup").fadeOut(300)
        clearPopup()
    }
})

$(".close").on("click",function(){
    $(".popup").fadeOut(300)
    clearPopup()
})
window.onclick = function(event){
    if(event.target == $(".popup")[0]){
        $(".popup").fadeOut(300)
        clearPopup()
    }
}

function deleteMeeting(id){
    Meetings.splice(id,1)
    writeToMeetingFile(Meetings)
}
$(".form-group").find("input[type=checkbox]").on("change",function(){
    if($(this).is(":checked")){
        $(".repeat").show(300)
        $(".non-repeat").hide(300)
    }else{
        $(".repeat").hide(300)
        $(".non-repeat").show(300)
    }
})

function convert24HourTimeTo12HourTime(time){
    var timeArray = time.split(":")
    console.log(timeArray);
    var hour = parseInt(timeArray[0])
    var minute = timeArray[1]
    var suffix = "AM"
    if(hour > 12){
        hour -= 12
        suffix = "PM"
    }
    if(hour == 12){
        suffix = "PM"
    }
    if(hour == 0){
        hour = 12
    }
    return `${hour}:${minute} ${suffix}`
}

function dateObjectToDateFormat(date,time){
    var dateArray = date.split(" ")
    console.log(dateArray);
    var timeArray = time.split(/[\s:]+/)
    var hour = parseInt(timeArray[0])
    var minute = timeArray[1]
    var suffix = timeArray[2]
    if(suffix == "PM"){
        hour += 12
    }
    if(hour < 10){
        hour = "0" + hour
    }
    console.log(timeArray);
    var month = monthStringToDateInt(dateArray[1])
    var day = dateArray[2]
    var year = dateArray[3]
    return `${year}-${month}-${day}T${hour}:${minute}`
}
function monthStringToDateInt(month){
    switch(month){
        case "Jan":
            return "01"
        case "Feb":
            return "02"
        case "Mar":
            return "03"
        case "Apr":
            return "04"
        case "May":
            return "05"
        case "Jun":
            return "06"
        case "Jul":
            return "07"
        case "Aug":
            return "08"
        case "Sep":
            return "09"
        case "Oct":
            return "10"
        case "Nov":
            return "11"
        case "Dec":
            return "12"
    }
}
//convert 12hour time to 24hour time
function convert12HourTimeTo24HourTime(time){
    var timeArray = time.split(":")
    var hour = parseInt(timeArray[0])
    var minute_and_suffix = timeArray[1].split(" ")
    var minute = minute_and_suffix[0]
    var suffix = minute_and_suffix[1]
    if(suffix == "PM"){
        hour += 12
    }
    if(hour < 10){
        hour = "0" + hour
    }
    return `${hour}:${minute}`
}

function isDateToday(date){
    var dateNow = new Date()
    return dateNow.getDate() == date.getDate() && dateNow.getMonth() == date.getMonth() && dateNow.getFullYear() == date.getFullYear()
}

$(".tab-item").on("click",function(){
    $(".tab-item").removeClass("active")
    $(this).addClass("active")
})

$(".tab-item:nth-of-type(1)").on("click",function(){
    $(".meetingList").empty()
    meetingFile()
})

$(".tab-item:nth-of-type(2)").on("click",function(){
    $(".Meeting").each(function(){
        var id = $(this).find(".meetingInfo:last-child").attr("id")
        Meetings[id].repeat ? $(this).show() : $(this).hide()
    })
    
})

$(".tab-item:nth-of-type(3)").on("click",function(){
    $(".Meeting").each(function(){
        var id = $(this).find(".meetingInfo:last-child").attr("id")
        if(!Meetings[id].repeat){
            var date = new Date(Meetings[id].date)
            if(isDateToday(date)){
                $(this).show()
            }else{
                $(this).hide()
            }
        }else{
            var reoccuringToday = false;
            for(var x = 0; x < Meetings[id].date.length; x++){
                if(isToday(Meetings[id].date[x])){
                    reoccuringToday = true;
                }
            }
            if(reoccuringToday){
                $(this).show()
            }else{
                $(this).hide()
            }
        }
    })
})


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

function attachClickEvents(){
    $(".meetingInfo").find("button").off("click")
    $(".meetingInfo").find("button:first-of-type").on("click",function(){
        var id = $(this).parent().attr('id')             
        open(Meetings[id].url)
    })
    $(".meetingInfo").find("button:last-of-type").off("mouseenter")
    $(".meetingInfo").find("button:last-of-type").on("mouseenter",function(){
        sessionStorage.setItem("meetingId",$(this).parent().attr('id'))              
    })
}

 function clearPopup(){
    $("#meetingName").val("")
    $("#meetingDate").val("")
    $("#meetingTime").val("")
    $("#meetingPlatform").val("")
    $("#meetingUrl").val("")
    $("#meetingRepeat").prop("checked",false)
    $(".repeat").hide()
    $(".non-repeat").show()
    $("option:selected").prop("selected", false)

 }

function displayDateStringArray(e){
    if(typeof e.date == "string"){
        return e.date
    }else{
        if(e.date.length == 7){
            return "Everyday"
        }else{
        return "Every " + getShortenedDays(e.date)
        }
    }   
}
function modalValidation(){
    if($("#meetingName").val() == ""){
        return false
    }else if(!$("#meetingRepeat").prop("checked") && $("#meetingDate").val() == ""){
        return false
    }else if($("#meetingTime").val() == "" && $("#meetingRepeat").prop("checked")){
        return false
    }else if($("#meetingPlatform").val() == ""){
        return false
    }else if($("#meetingUrl").val() == ""){
        return false
    }else if($("#meetingRepeat").prop("checked") && $("#meetingRepeatDays").find(":selected").text() == ""){
        return false
    }else{
        return true
    }   
}