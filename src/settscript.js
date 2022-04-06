const path = require('path')

$(".restartWarning").hide()
function configFile()
{



function radioSave(){
  var radioInputs = document.querySelectorAll('input[type="radio"]');//stores as nodelist which are arrays but not really
  var arrRadioData = [];
  radioInputs.forEach((input) => {
    arrRadioData.push({ id: input.id, checked: input.checked });
  });
  localStorage.setItem('radioInputs', JSON.stringify(arrRadioData));
}
function checkBoxSave(){
  var checkBoxInputs = document.querySelectorAll('input[type="checkbox"]');
  var arrCheckBoxData = [];
  checkBoxInputs.forEach((input) => {
    arrCheckBoxData.push({ id: input.id, checked: input.checked });
  });
  localStorage.setItem('checkBoxInputs', JSON.stringify(arrCheckBoxData));
}
function radioLoad(){
  if(localStorage.radioInputs){
    var radioInputs = JSON.parse(localStorage.getItem('radioInputs'));
  radioInputs.forEach((input) => {
    document.getElementById(input.id).checked = input.checked;
    if(input.checked){
      document.getElementById(input.id).parentElement.style.opacity = "1"
    }
  });
  }else{
    radioSave();
    radioLoad();
  }
}
function checkBoxLoad(){
  if(localStorage.checkBoxInputs){
    var checkBoxInputs = JSON.parse(localStorage.getItem('checkBoxInputs'));
  checkBoxInputs.forEach((input) => {
    document.getElementById(input.id).checked = input.checked;
  });
  }else{
    checkBoxSave();
    checkBoxLoad();
  }
}
function selSetTheme(){
  $(".settingsBox:first-child span").css("color","black");
  (localStorage.ldMode == "dark") ? $(".settingsBox:first-child").find("span#selectedSetting").css("color","#d1d1d1") : $(".settingsBox:first-child").children("span").css("color","black")
  $(".settingsBox:first-child").children("span").css("background-color","#d1d1d1")
  $("#selectedSetting").css("background-color","#008891")
}
radioLoad();
checkBoxLoad();
selSetTheme()

$(`#${$("#selectedSetting").html()}`).show()
$("#selectedSetting").css("background-color","#008891")
$(".optionContainer").find(".radio").on("click",function(){
  $(this).find("input").prop("checked",true)
  $(".optionContainer").find(".radio").css("opacity",".5")
  $(this).css("opacity","1")
  radioSave()
  if(ch1.checked){
    localStorage.setItem('ldMode','light');
   }else if(!ch1.checked){
    localStorage.setItem('ldMode','dark');
   }
  location.reload();
});
$(".optionContainer").find(".radio").on("mouseenter",function(){
  $(this).css("opacity","1")
});
$(".optionContainer").find(".radio").on("mouseleave",function(){
  if($(this).find("input").prop("checked") != true){
    $(this).css("opacity",".5")
  }
});
$(".optionContainer").find(".checkBox").on("click",function(){
  ($(this).find("input").prop("checked")) ? $(this).find("input").prop("checked",false) : $(this).find("input").prop("checked",true)
  checkBoxSave()
});
$(".settingsBox:first-child").children("span").on("mouseenter",function(){
  if($(this).attr("id") != "selectedSetting"){
    $(this).css("background-color","grey")
  }
});
$(".settingsBox:first-child").children("span").on("mouseleave",function(){
  if($(this).attr("id") != "selectedSetting"){
    $(this).css("background-color","#d1d1d1")
  }
});
$(".settingsBox:first-child").children("span").on("click",function(){
  $(".settingsBox:first-child").children().removeAttr("id")
  $(".settingsBox:last-child").children().hide()
  $(this).attr("id","selectedSetting")
  selSetTheme()
  $(`#${$(this).html()}`).show()
});
$("#Appearance").find(".optionContainer").find(".eventMarkerVis").on("click",function(){
  console.log("dn")
  if($(this).find("input").prop("checked")){
    localStorage.setItem("eventMarkerVis","show")
  }else{
    localStorage.setItem("eventMarkerVis","hide")
  }
  
})

}
configFile()