$(".restartWarning").hide()

function radioSave(){
  var radioInputs = document.querySelectorAll('input[type="radio"]');//stores as nodelist which are arrays but not really
  var arrRadioData = [];
  radioInputs.forEach((input) => {
    arrRadioData.push({ id: input.id, checked: input.checked });
  });
  if(!localStorage.radioInputs){arrRadioData.forEach((e)=>{if(e.id == 'ch1'){e.checked = true}})}
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
    try{
      document.getElementById(input.id).checked = input.checked;
    }catch(err){
      localStorage.removeItem('checkBoxInputs');
    }
  });
  }else{
    checkBoxSave();
    checkBoxLoad();
  }
}

radioLoad();
checkBoxLoad();

$(`#${$("#selectedSetting").html()}`).show()
$(".optionContainer").find(".radio").on("click",function(){
  if(!$(this).find("input").prop("checked")){
    $(this).find("input").prop("checked",true)
    let themeIndex = config.Settings.Theme.Name.indexOf($(this).text().replace("check",""))
    config.Settings.Theme.IndexChosen = themeIndex;
    localStorage.setItem("Config",JSON.stringify(config))
    radioSave()
    ThemeChange()
  }
});

$(".optionContainer").find(".checkBox").on("click",function(){
  ($(this).find("input").prop("checked")) ? $(this).find("input").prop("checked",false) : $(this).find("input").prop("checked",true)
  checkBoxSave()
});

$(".settingsBox:first-child").children("span").on("click",function(){
  $(".settingsBox:first-child").children().removeAttr("id")
  $(".settingsBox:last-child").children().hide()
  $(this).attr("id","selectedSetting")
  $(`#${$(this).html()}`).show()
});

$("#Appearance").find(".optionContainer").find(".eventMarkerVis").on("click",function(){
  if($(this).find("input").prop("checked")){
    config.Settings.EventMarkerVisible = true;
  }else{
    config.Settings.EventMarkerVisible = false;
  }
  localStorage.setItem("Config",JSON.stringify(config))
})

