const $ = require('jquery');
var currentDocUrlString = document.URL;
var pageList = ["home.html","task.html","note.html","event.html","meetings.html","settings.html"];
const fs = require('fs');
const path = require('path');
const os = require('os');
const dir = path.join(os.homedir + "\\AppData\\Roaming\\Pollorino\\JSON_Data");
var config;
const configTemplate = {
  Settings: {
    MinimizeOnClose: false,
    OpenOnStartup: false,
    EventMarkerVisible: true,
    Theme: {
      Name: [
        "Midnight",
        "AquaLight",
        "Cherry",
        "Nature"
      ],
      "IndexChosen": 1
    }
  }
}
if(localStorage.Config){
   config = JSON.parse(localStorage.Config)
}else{
  localStorage.setItem("Config",JSON.stringify(configTemplate))
}

if (!fs.existsSync(dir)){
    fs.mkdirSync(dir, { recursive: true });
}

function openNav(){
  document.getElementById("mySidenav").style.width = "200px";
  document.getElementById("mySidenav").style.transition = ".3s";
  $(".content").css("opacity","0.5")
}
function closeNav(){
  document.getElementById("mySidenav").style.width = "50px";
  document.getElementById("mySidenav").style.transition = ".3s";
  $(".content").css("opacity","1")
}

$(".NavBox").on("mouseenter",function(){
  if($(this).find(".selectedNavOption").css("display") != "block" && $(this).find(".selectedNavOption").attr("id") != "currentHoverIndicator")
  {
    $(this).find(".selectedNavOption").css("height","0px")
    $(this).find(".selectedNavOption").show()
    $(this).find(".selectedNavOption").animate({height:"25px"},50)
    $(this).find(".selectedNavOption").attr("id","currentHoverIndicator")
  }
})

$(".NavBox").on("mouseleave", function (){
    if($(this).find(".selectedNavOption").attr("id") == "currentHoverIndicator")
    {
       $(this).find(".selectedNavOption").removeAttr("id")
       $(this).find(".selectedNavOption").animate({height:"0px"},50)
       $(this).find(".selectedNavOption").hide(50,function(){$(this).find(".selectedNavOption").css("height","42.5%")})
    }
})
for(var x = 0;x < pageList.length;x++){
  if(currentDocUrlString.includes(pageList[x])){
    document.getElementsByClassName('selectedNavOption')[x].style.display = "block"
  }
}
window.onload = () => {
  $(".se-pre-con").fadeOut("slow");
}

function ThemeChange() {
  config = JSON.parse(localStorage.Config)
  var theme = $("#ThemeStyleSheet")
  for( var i = 0; i < config.Settings.Theme.Name.length; i++){
    if(i == config.Settings.Theme.IndexChosen){
      theme.attr("href",`../themes/${config.Settings.Theme.Name[i]}.css`)
    }
  }
}
ThemeChange()





