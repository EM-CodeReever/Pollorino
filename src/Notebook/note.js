var QuillDeltaToHtmlConverter = require('quill-delta-to-html').QuillDeltaToHtmlConverter;
let Notes = []
async function checkForLocalStorageNotebook(){
    if(!localStorage.Notebook){
        localStorage.setItem('Notebook',JSON.stringify([]))
    }
    Notes = JSON.parse(localStorage.Notebook)
    console.log(Notes);
}
checkForLocalStorageNotebook()
class Note{
    constructor(title,desc,id){
        this.Id = id
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
            Notes.forEach((note) => {
                $(".Note-Grid").append(
                `<div class="Notes" id="${note.Id}">
                    <span class="Headings">
                        <i class="material-icons note-delete-btn">delete</i><p ${note.isMarked ? "class=\"marked\"" : ""}>${note.Title}</p>
                    </span>
                    <span class="Headings">
                        <button class="btnViewNote n-btn" style="display:none;">View</button>
                        <button class="btnEditNote n-btn" style="display:none;">Edit</button>
                        <button class="btnMarkNote n-btn" style="display:none;">Mark</button>
                        <button class="options"><i class="material-icons">more_vert</i></button>
                    </span>
                </div>`)
            })
            if(Notes.length == 0){
                $(".Note-Grid").append(`<p class="no-notes">No Notes Yet</p>`)
            }else{
                $(".Note-Grid").find(".no-notes").remove()
            }
            $(".btnEditNote").on('click',function(){
                UpdateOperation(true)
                var Id = $(this).parent().parent().attr('id')
                let selectedNote = Notes.find(e => e.Id == Id)
                $("#Note-Title").val(selectedNote.Title)
                $("#Note-Description").val(selectedNote.Description)
                quill.setContents(selectedNote.Delta)
                $(".Note-Container").fadeOut(200,()=>{$(".Note-Editor").fadeIn(300)})
                sessionStorage.setItem('CurrentNoteId',Id)
            })
            $(".btnViewNote").on('click',function(){
                var Id = $(this).parent().parent().attr('id')
                let selectedNote = Notes.find(e => e.Id == Id)
                sessionStorage.setItem('CurrentNoteId',Id)
                $("#NoteDisplay-Title").html(selectedNote.Title)
                $("#NoteDisplay-Description").html(selectedNote.Description)
                $("#NoteDisplay-Body").append(selectedNote.HTMLContent)
                $(".Note-Container").fadeOut(200,()=>{$(".Note-Viewer").fadeIn(300)})
            })
            $(".note-delete-btn").on('click',function(){
                let Id = $(this).parent().parent().attr('id')
                Notes = Notes.filter(note => note.Id != Id)
                console.log(Notes);
                WriteToNoteFile(Notes)
            })
            
            $(".btnMarkNote").on('click',function(){
                let SelectedID = $(this).parent().parent().attr('id')
                let noteIndex = Notes.findIndex((note => note.Id == SelectedID));
                console.log(noteIndex);
                Notes[noteIndex].isMarked = !Notes[noteIndex].isMarked
                if(Notes[noteIndex].isMarked){
                    $(`#${SelectedID}`).find("p").addClass('marked');
                }else{
                    $(`#${SelectedID}`).find("p").removeClass('marked');
                }
                WriteToNoteFile(Notes)
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
            $('.options, .n-btn').on('click',function(){
                $(this).parent().children('.n-btn').toggle(200)
            })
        }   
noteFile()
function ClearEditor(){
    $("#Note-Title").val('')
    $("#Note-Description").val('')
    quill.setContents([])
}

function WriteToNoteFile(Obj){
    localStorage.setItem('Notebook',JSON.stringify(Notes))
    $(".Note-Grid").empty();
    noteFile()
    $(".Note-Editor").fadeOut(200,()=>{$(".Note-Container").fadeIn(300)})
}

function DisplayError(err){
    $("#ErrorMsg").html(err)
    $("#ErrorMsg").fadeIn(300)
    setTimeout(function(){$("#ErrorMsg").fadeOut(300)},2000)
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
    var NewNote = new Note(title,desc,crypto.randomUUID())
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
    let Id = sessionStorage.CurrentNoteId;
    let noteIndex = Notes.findIndex((note => note.Id == Id));
    let UpdatedNote;
    try{
        UpdatedNote = GetCurrentNoteInstance()
        Notes[noteIndex] = UpdatedNote;
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


