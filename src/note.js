var QuillDeltaToHtmlConverter = require('quill-delta-to-html').QuillDeltaToHtmlConverter;
var NotebookStorage = []
var filePath = path.join(dir + "\\NotebookStorage.json");
var noteTemplate = {NoteList: []}

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
  
async function noteFile(){
    fs.readFile(filePath,"utf-8",(err,jsonString) => {
        if(err){
            console.log(err)
            fs.writeFile(filePath,JSON.stringify(noteTemplate, null, 2),err => {
                if(err){
                    console.log(err)
                }
                noteFile()
            })
        }else{
            NotebookStorage = JSON.parse(jsonString)
            for(var i = (NotebookStorage.NoteList.length - 1); i >= 0; i--){
                $(".Note-Grid").append(
                `<div class="Notes" id="${i}">
                <span class="Headings"><input type="checkbox"><p ${NotebookStorage.NoteList[i].isMarked ? "class=\"marked\"" : ""}>${NotebookStorage.NoteList[i].Title}</p></span>
                <span class="Headings"><button class="btnViewNote">View</button><button class="btnEditNote">Edit</button></span>
                </div>`)
            }
            $(".btnEditNote").on('click',function(){
                UpdateOperation(true)
                var Id = Number($(this).parent().parent().attr('id'))
                console.log(Number($(this).parent().parent().attr('id')))
                $("#Note-Title").val(NotebookStorage.NoteList[Id].Title)
                $("#Note-Description").val(NotebookStorage.NoteList[Id].Description)
                quill.setContents(NotebookStorage.NoteList[Id].Delta)
                $(".Note-Container").fadeOut(200,()=>{$(".Note-Editor").fadeIn(300)})
                sessionStorage.setItem('CurrentNoteId',Id)
            })
            $(".btnViewNote").on('click',function(){
                var Id = Number($(this).parent().parent().attr('id'))
                sessionStorage.setItem('CurrentNoteId',Id)
                $("#NoteDisplay-Title").html(NotebookStorage.NoteList[Id].Title)
                $("#NoteDisplay-Description").html(NotebookStorage.NoteList[Id].Description)
                $("#NoteDisplay-Body").append(NotebookStorage.NoteList[Id].HTMLContent)
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
    })
}
noteFile()

function ClearEditor(){
    $("#Note-Title").val('')
    $("#Note-Description").val('')
    quill.setContents([])
}

function WriteToNoteFile(Obj){
    fs.writeFile(filePath,JSON.stringify(Obj, null, 2),err =>{
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
        // Equivalent to { toolbar: { container: '#toolbar' }}
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
        NotebookStorage.NoteList.push(NewNote)
        WriteToNoteFile(NotebookStorage)          
        ClearEditor()
    }catch(err){
        DisplayError(err)
    }
})

$("#SaveNote").on('click',()=>{
    var Id = Number(sessionStorage.CurrentNoteId)
    var UpdatedNote
    try{
        UpdatedNote = GetCurrentNoteInstance()
        NotebookStorage.NoteList[Id] = UpdatedNote;
        WriteToNoteFile(NotebookStorage)
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
        NotebookStorage.NoteList.splice(SelectedArray[i],1)
        $(`#${SelectedArray[i]}`).remove()
    }
    $(".SelectionOptionsSpan").children().fadeOut(300)
    WriteToNoteFile(NotebookStorage)
})

$("#btnMark").on('click',()=>{
    var SelectedArray = []
    var SelectedID
    $(":checked").each(function(){
        SelectedID = Number($(this).parent().parent().attr('id'))
        NotebookStorage.NoteList[SelectedID].isMarked = !NotebookStorage.NoteList[SelectedID].isMarked
        SelectedArray.push(SelectedID)
    })
    console.log(NotebookStorage.NoteList[SelectedID].isMarked)
    console.log(SelectedArray)
    for(var i = 0; i < SelectedArray.length; i++){
        if(NotebookStorage.NoteList[SelectedArray[i]].isMarked){
            $(`#${SelectedArray[i]}`).find("p").addClass('marked');
        }else{
            $(`#${SelectedArray[i]}`).find("p").removeClass('marked');
        }
    }
    clearSelection()
    WriteToNoteFile(NotebookStorage)
})

$("#btnCancelSelection").on('click',()=>{
    clearSelection()
})
