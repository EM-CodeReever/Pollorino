var QuillDeltaToHtmlConverter = require('quill-delta-to-html').QuillDeltaToHtmlConverter;
var filePath = path.join(dir + "\\NotebookStorage.json");
let { Notes } = require(filePath)
class Note{
    constructor(title,desc){
        this.Title = title;
        this.Description  = desc;
        this.isMarked = false;
        this.Delta = null;
        this.HTMLContent = null;
    }
}
var toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
    [{ 'header': 1 }, { 'header': 2 }],               // custom button values
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
    [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
    [{ 'direction': 'rtl' }],                         // text direction
    [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
    [{ 'font': [] }],
    [{ 'align': [] }],
    [ 'link', 'image', 'video'],
    ['clean']                                         // remove formatting button
  ];
  
function noteFile(){
            Notes.forEach((note,index) => {
                $(".Note-Grid").append(
                `<div class="Notes" id="${index}">
                <span class="Headings"><input type="checkbox"><p ${note.isMarked ? "class=\"marked\"" : ""}>${note.Title}</p></span>
                <span class="Headings"><button class="btnViewNote">View</button><button class="btnEditNote">Edit</button></span>
                </div>`)
            })
            if(Notes.length == 0){
                $(".Note-Grid").append(`<p class="no-notes">No Notes Yet</p>`)
            }else{
                $(".Note-Grid").find(".no-notes").remove()
            }
            $(".btnEditNote").on('click',function(){
                UpdateOperation(true)
                var Id = Number($(this).parent().parent().attr('id'))
                $("#Note-Title").val(Notes[Id].Title)
                $("#Note-Description").val(Notes[Id].Description)
                quill.setContents(Notes[Id].Delta)
                $(".Note-Container").fadeOut(200,()=>{$(".Note-Editor").fadeIn(300)})
                sessionStorage.setItem('CurrentNoteId',Id)
            })
            $(".btnViewNote").on('click',function(){
                var Id = Number($(this).parent().parent().attr('id'))
                sessionStorage.setItem('CurrentNoteId',Id)
                $("#NoteDisplay-Title").html(Notes[Id].Title)
                $("#NoteDisplay-Description").html(Notes[Id].Description)
                $("#NoteDisplay-Body").append(Notes[Id].HTMLContent)
                $(".Note-Container").fadeOut(200,()=>{$(".Note-Viewer").fadeIn(300)})
            })
            $(":checkbox").on('change',function(){
                var sel = 0
                $(":checkbox").each(function(){
                    if($(this).is(":checked")){sel++}
                })
                if(sel != 0){
                    $("#SelectedItemsText").html(`${sel} Items Selected`)
                    $(".SelectionOptionsSpan").children().slideDown(150)
                }else{
                    $(".SelectionOptionsSpan").children().slideUp(150)
                }
            })
        }   
noteFile()

function ClearEditor(){
    $("#Note-Title").val('')
    $("#Note-Description").val('')
    quill.setContents([])
}

function WriteToNoteFile(Obj){
    fs.writeFile(filePath,JSON.stringify({"Notes":Obj}, null, 2),err =>{
        if(err){
            console.log(err)
        }else{
            $(".Note-Grid").empty();
            noteFile()
            $(".Note-Editor").fadeOut(200,()=>{$(".Note-Container").fadeIn(300)})
        }
    })
}

function DisplayError(err){
    $("#ErrorMsg").html(err)
    $("#ErrorMsg").fadeIn(300)
    setTimeout(function(){$("#ErrorMsg").fadeOut(300)},2000)
}

function clearSelection(){
    $(".SelectionOptionsSpan").children().fadeOut(300)
    $(":checked").each(function(){
        $(this).prop('checked', false)
    })
}

function UpdateOperation(bool){
    if(bool){
        $('#CreateNewNote').hide()
        $('#SaveNote').show()
    }else{
        $('#CreateNewNote').show()
        $('#SaveNote').hide()
    }
}

function GetCurrentNoteInstance(){
    var title = $("#Note-Title").val()
    var desc = $("#Note-Description").val()
    var converter = new QuillDeltaToHtmlConverter(quill.getContents().ops)
    var QuillHtml = converter.convert()
    if(title == "" || desc == ""){
        throw "Enter both a Title and Description";
    }else if(quill.getContents().ops[0].insert == '\n' && quill.getContents().ops.length == 1){
        throw "Body cannot be empty"
    }
    var NewNote = new Note(title,desc)
    NewNote.Delta = quill.getContents()
    NewNote.HTMLContent = QuillHtml
    return NewNote;
}
var quill = new Quill('.Note-Textarea', {
    modules: {
        toolbar: toolbarOptions
    },
    theme: 'snow',
  });

$("#CreateNote").on('click',()=>{
    UpdateOperation(false)
    $(".Note-Container").fadeOut(200,()=>{$(".Note-Editor").fadeIn(300)})
})

$("#CreateNewNote").on('click',()=>{
    var NewNote
    try{
        NewNote = GetCurrentNoteInstance()
        Notes.unshift(NewNote)
        WriteToNoteFile(Notes)          
        location.reload()
    }catch(err){
        DisplayError(err)
    }
})

$("#SaveNote").on('click',()=>{
    var Id = Number(sessionStorage.CurrentNoteId)
    var UpdatedNote
    try{
        UpdatedNote = GetCurrentNoteInstance()
        Notes[Id] = UpdatedNote;
        WriteToNoteFile(Notes)
        ClearEditor()
    }catch(err){
        DisplayError(err)
    }
})

$("#Cancel").on('click',()=>{
    $(".Note-Editor").fadeOut(200,()=>{$(".Note-Container").fadeIn(300)})
    ClearEditor()
})

$("#ReturnToNotes").on('click',()=>{
    $(".Note-Viewer").fadeOut(200,()=>{$(".Note-Container").fadeIn(300)})
    $("#NoteDisplay-Body").empty()
})
$("#btnDelete").on('click',()=>{
    var SelectedArray = []
    $(":checked").each(function(){
        SelectedArray.push(Number($(this).parent().parent().attr('id')))
    })
    for(var i = 0; i < SelectedArray.length; i++){
        Notes.splice(SelectedArray[i],1)
        $(`#${SelectedArray[i]}`).remove()
    }
    $(".SelectionOptionsSpan").children().fadeOut(300)
    WriteToNoteFile(Notes)
})

$("#btnMark").on('click',()=>{
    var SelectedArray = []
    var SelectedID
    $(".Headings").find(":checked").each(function(){
        SelectedID = Number($(this).parent().parent().attr('id'))
        Notes[SelectedID].isMarked = !Notes[SelectedID].isMarked
        SelectedArray.push(SelectedID)
    })
    for(var i = 0; i < SelectedArray.length; i++){
        if(Notes[SelectedArray[i]].isMarked){
            $(`#${SelectedArray[i]}`).find("p").addClass('marked');
        }else{
            $(`#${SelectedArray[i]}`).find("p").removeClass('marked');
        }
    }
    clearSelection()
    WriteToNoteFile(Notes)
})

$("#btnCancelSelection").on('click',()=>{
    clearSelection()
})
