var currentBook;
var textUpdate;
var title;
var noteOptions = "";
const path = require('path')
var filePath = path.join(__dirname + "\\jsonFiles\\NotebookStorage.json");
var noteTemplate = {NoteBook: []}
function noteFile(){
    fs.readFile(filePath,"utf-8",(err,jsonString) => {
        if(err){
            console.log(err)
            fs.writeFile(filePath,JSON.stringify(noteTemplate, null, 2),err => {
                if(err){
                    console.log(err)
                }
            })
            noteFile()
        }else{
            var Note = JSON.parse(jsonString)
            for(var x = 0; x < Note.NoteBook.length; x++){
                var Book = document.createElement('div');
                Book.setAttribute("class","books");
                var bookContent = `<p>${Note.NoteBook[x].Name}</p><div class="bookDelete"><span class="material-icons">delete</span></div>`
                Book.innerHTML = bookContent
                $(".noteBox:first-child").append(Book)
                for(var i = 0; i < Note.NoteBook[x].Topic.length; i++){
                    
                    var topic = document.createElement("div")
                    topic.setAttribute("class","topic")
                    topic.innerHTML = Note.NoteBook[x].Topic[i].Title
                    Book.appendChild(topic)
                }
            }
            $(".bookDelete").hide()
            $(".books").on("click",function(){
                var huh = $(this).children().length - 2;
                huh *= 25;
                $(this).animate({height : (huh+50)},200)
            })
            $(".books").on("mouseenter",function(){
                $(this).find(".bookDelete").fadeIn(200)
            })
            $(".books").on("mouseleave",function(){
                $(this).animate({height : "50px"},200)
                $(this).find(".bookDelete").fadeOut(200)
            })
            $(".bookDelete").find("span").on("click",function(){
                var thisBook = $(this).parent().parent()
                    for(var x = 0; x < Note.NoteBook.length; x++){
                        if(thisBook.find("p").html() == Note.NoteBook[x].Name){
                            Note.NoteBook.splice(x,1)
                            fs.writeFile(filePath,JSON.stringify(Note, null, 2),err =>{
                                if(err){
                                    console.log(err)
                                }else{
                                        location.reload()
                                }
                            })
                        }
                    }
            })
            $(".topic").on("click",function(){
                $(".buttonHolder").find("button").prop('disabled', false);
            })
            $(".topic").on("click",function(){
                // console.log($(this).html())
                // console.log($(this).parent().find("p").html())
                for(var x = 0; x < Note.NoteBook.length; x++){
                    if(Note.NoteBook[x].Name == $(this).parent().find("p").html()){
                        for(var i = 0; i < Note.NoteBook[x].Topic.length; i++){
                            if($(this).html() == Note.NoteBook[x].Topic[i].Title){
                                currentBook = Note.NoteBook[x].Name;
                                $("#noteTitle").html("Topic: " + Note.NoteBook[x].Topic[i].Title)
                                $("#noteDesc").html("Description: " + Note.NoteBook[x].Topic[i].Desc)
                                $(".textDisplay").html(Note.NoteBook[x].Topic[i].text)
                                
                            }

                        }
                        
                    }
                    
                }
            })
            $("#noteEdit").on("click",function(){
                $(".textDisplay").attr('contenteditable','true');
                $(".textDisplay").trigger("focus")
            })
            $("#noteSave").on("click",function(){
                $(".textDisplay").attr('contenteditable','false');
                textUpdate = $(".textDisplay").html()
                title = $("#noteTitle").html()
                title = title.substr(7)
                // console.log(currentBook)
                for(var x = 0; x < Note.NoteBook.length; x++){
                    if(Note.NoteBook[x].Name == currentBook){
                        for(var i = 0; i < Note.NoteBook[x].Topic.length; i++){
                            if(title == Note.NoteBook[x].Topic[i].Title){
                                Note.NoteBook[x].Topic[i].text = textUpdate;
                                fs.writeFile(filePath,JSON.stringify(Note, null, 2),err =>{
                                    if(err){
                                        console.log(err)
                                    }
                                })
                            }
                        }
                    }
                }
               
            })
            $("#noteDelete").on("click",function(){
                title = $("#noteTitle").html()
                title = title.substr(7)
                for(var x = 0; x < Note.NoteBook.length; x++){
                    if(Note.NoteBook[x].Name == currentBook){
                        for(var i = 0; i < Note.NoteBook[x].Topic.length; i++){
                            if(title == Note.NoteBook[x].Topic[i].Title){
                                Note.NoteBook[x].Topic.splice(i,1)
                                fs.writeFile(filePath,JSON.stringify(Note, null, 2),err =>{
                                    if(err){
                                        console.log(err)
                                    }else{
                                        location.reload()
                                    }
                                })
                            }
                        }
                    }
                }
                
            })
            $("#add_Note_Btn").on("click",function(){
                var existingBook = false;
                var existingTopic = false;
                if($("#choice").val() == "Book"){
                    for(var x = 0; x < Note.NoteBook.length; x++){
                        if($("#bookInput").val() == Note.NoteBook[x].Name){
                            $("#bookErrorMsg").html(`Book With Name '${$("#bookInput").val()}' Already Exists`)
                            $("#bookErrorMsg").fadeIn(300)
                            existingBook = true;
                        }
                    }
                    if(!existingBook){
                        Note.NoteBook.push({
                            Name: $("#bookInput").val(),
                            Topic: []
                        })
                        fs.writeFile(filePath,JSON.stringify(Note, null, 2),err =>{
                            if(err){
                                console.log(err)
                            }else{
                                location.reload()
                            }
                        })
                    }
                }else if($("#choice").val() == "Topic"){
                    for(var x = 0; x < Note.NoteBook.length; x++){
                        if($("#bookChoice").val() == Note.NoteBook[x].Name){
                            for(var i = 0; i < Note.NoteBook[x].Topic.length; i++){
                                if($("#topicInput").val() == Note.NoteBook[x].Topic[i].Title){
                                    $("#topicErrorMsg").html(`Topic With Name '${$("#topicInput").val()}' Already Exists`)
                                    $("#topicErrorMsg").fadeIn(300)
                                    existingTopic = true;
                                }
                            }
                            if(!existingTopic){
                                Note.NoteBook[x].Topic.push({
                                    Title: $("#topicInput").val(),
                                    Desc: $("#descInput").val(),
                                    text: ""
                                })
                                fs.writeFile(filePath,JSON.stringify(Note, null, 2),err =>{
                                    if(err){
                                        console.log(err)
                                    }else{
                                        location.reload()
                                        
                                    }
                                }) 
                            }
                        }
                    }
                }else{
                    console.log("Error!")
                }
            })
            for(var x = 0; x < Note.NoteBook.length; x++){
                noteOptions = `<option value="${Note.NoteBook[x].Name}">${Note.NoteBook[x].Name}</option>`
                $("#bookChoice").append(noteOptions)
            }           
            // --------
        }
    })
}
noteFile()

$(".buttonHolder").find("button").prop('disabled', true);
$(".noteAddBtn").on("click",function(){
    $(".popup").fadeIn(200)
})
$(".close").on("click",function(){
    $(".popup").fadeOut(200)
})
$(window).on("click",function(e) {
    if(e.target.className == "popup"){
        $(".popup").fadeOut(200)
    }
});
$("#choice").on("change",function(){
    $("#topicErrorMsg").hide()
    $("#bookErrorMsg").hide()
    $(".addForm:nth-child(2)").toggle(200)
    $(".addForm:nth-child(1)").toggle(200)
})

