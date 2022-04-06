var hoverlight = ".NavBox:hover{background-color: #008891;}";
var hoverdark = ".NavBox:hover{background-color: #000a1c;}";
var scrollContentDark = ".content::-webkit-scrollbar-thumb{background-color: rgba(236, 236, 236, 0.856);}";
var scrollContentLight = ".content::-webkit-scrollbar-thumb{background-color: rgba(0, 0, 0, 0.623);}";

if(!localStorage.ldMode){
    localStorage.setItem('ldMode',"dark")
}
function modeSwitch(){
    var style = document.createElement('style');
    var colorMode = localStorage.ldMode;
    if(colorMode === "dark"){
        $(".se-pre-con").css("background-color","#1c2c47");
        $("#mBody").css("background-color","#1c2c47");
        $("#webHead").css("background-color","#0d1f3d");
        $("#mySidenav").css("background-color","#0d1f3d");
        $("#mySidenav").css("transition","0s");
        $("#barbtn").css("background-color","#000a1c");
        $("#barbtn").css("color","#d1d1d1");
        $("#topbar").css("background-color","#000a1c");
        $("#topTitle").css("color","#d1d1d1");
        $(".maticn").css("-webkit-text-stroke","1.2px #d1d1d1")
        $(".selectedNavOption").css("background-color","#d1d1d1")
        $(".textSection").children("p").css("color","#d1d1d1")
        $("#max-btn").css("color","#d1d1d1");
        $("#min-btn").css("color","#d1d1d1");
        $("#close-btn").css("color","#d1d1d1");
        $("#webHeadTitle").css("color","#d1d1d1");
        $("#contB-Wrap").css("background-color","black");
        $("#contB-Wrap").find("h1").css("color","white");
        $(".contChild").find("h2").css("color","white")
        $("#footer").css("background-color","#1c2c47");
        $("#General").find(".optionContainer").find("span").css("background-color","var(--darkBlue)")
        $("#General").find(".optionContainer").find("span").css("color","#d1d1d1")
        $("#Appearance").find(".optionContainer").find("span:nth-of-type(n+3)").css("background-color","var(--darkBlue)")
        $("#Appearance").find(".optionContainer").find("span:nth-of-type(n+3)").css("color","#d1d1d1")
        $(".noteBox:first-child").find("h2").css("color","#d1d1d1")
        $(".noteHeader").css("background-color","black")
        $(".buttonHolder").css("background-color","black")
        style.appendChild(document.createTextNode(hoverdark));
        style.appendChild(document.createTextNode(scrollContentDark));
        document.getElementsByTagName('head')[0].appendChild(style);
        $(".switches").css("background","none");
    }else if (colorMode === "light"){
        $(".se-pre-con").css("background-color","#d1d1d1");
        $("#mBody").css("background-color","rgb(221, 221, 221)");
        $("#webHead").css("background-color","#d1d1d1");
        $("#mySidenav").css("background-color","#d1d1d1");
        $("#mySidenav").css("transition","0s");
        $("#barbtn").css("background-color","#008891");
        $("#barbtn").css("color","black");
        $("#topbar").css("background-color","#008891");
        $("#topTitle").css("color","black");
        $(".maticn").css("-webkit-text-stroke","1.2px black")
        $(".selectedNavOption").css("background-color","black")
        $(".textSection").children("p").css("color","black")
        $(".radio:first-child").find("i.material-icon").css("color","#d1d1d1")
        $("#max-btn").css("color","black");
        $("#min-btn").css("color","black");
        $("#close-btn").css("color","black");
        $("#webHeadTitle").css("color","black");
        $(".contChild:first-child").css("background-color","#008891");
        $(".contChild").find("h2").css("color","black")
        $(".containerB").find("div").css("background-color","#008891");
        $(".containerB").find("div").css("color","black");
        $("#contB-Wrap").find("h1").css("color","black");
        $(".entry").css("background-color","rgb(0,0,0,0.5)");
        $(".eventCard").css("background-color","rgb(0,0,0,0.5)");
        $(".eventContainer").css("background-color","#008891");
        $(".subcont").css("background-color","#008891");
        $(".wrapper").css("background-color","rgb(0,0,0,0.5)");
        $(".tile").css("background-color","rgb(0,0,0,0.5)");
        $("#addEvent").css("background-color","rgb(0,0,0,0.5)");
        $(".footer").css("background-color","rgb(221, 221, 221);");
        $("#General").find(".optionContainer").find("span").css("background-color","var(--lightBlue)")
        $("#General").find(".optionContainer").find("span").css("color","var(--black)")
        $("#Appearance").find(".optionContainer").find("span:nth-of-type(n+3)").css("background-color","var(--lightBlue)")
        $("#Appearance").find(".optionContainer").find("span:nth-of-type(n+3)").css("color","var(--black)")
        $(".noteBox:first-child").find("h2").css("color","black")
        $(".noteHeader").css("background-color","#008891")
        $(".noteHeader").find("h3").css("color","black")
        $(".buttonHolder").css("background-color","#008891")
        style.appendChild(document.createTextNode(hoverlight));
        style.appendChild(document.createTextNode(scrollContentLight));
        document.getElementsByTagName('head')[0].appendChild(style);
    }
}

modeSwitch();
    