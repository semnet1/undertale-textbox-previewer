// variáveis
let content = document.getElementById("content");
let infoPage = document.getElementById("infoPage");
let configsPage = document.getElementById("configsPage");
let infoOpen = false;
let configsOpen = false;
let curBoxType = "Box";
let face = false;
let size = false;

let playLoop;
let stringPos = 0;
let playing = false;
let timer = 0;

let canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

let textInput = document.getElementById("textInput");
let textboxBtn = document.getElementById("textboxButton");
let bubbleBtn = document.getElementById("bubbleButton");
let typerSelect = document.getElementById("typerSelect");

let warning = document.getElementById("warning");
let inputs = {
    "Font":     document.getElementById("fontSelect"),
    "Color":    document.getElementById("colorInput"),
    "XEnd":     document.getElementById("xendInput"),
    "Shake":    document.getElementById("shakeInput"),
    "Speed":    document.getElementById("speedInput"),
    "Sound":    document.getElementById("soundSelect"),
    "Spacing":  document.getElementById("spacingInput"),
    "VSpacing": document.getElementById("vspacingInput")
}

// typer
let curTyper = {
    "Name": 4,
    "Font": "maintext",
    "Color": "#ffffff",
    "XEnd": 548,
    "Shake": 0,
    "Speed": 1,
    "Sound": "txttor",
    "Spacing": 8,
    "VSpacing": 18
}

// configs
Object.entries(inputs).forEach((entry) => {
    let name = entry[0];
    let input = entry[1];

    input.oninput = () => {
        curTyper[name] = input.value;
        inputDetected();
    }
});

// ajustes
function resize(){
    if(infoOpen){
        infoPage.style.right = content.getBoundingClientRect().left - 200 + "px";
    } else{
        infoPage.style.right = content.getBoundingClientRect().left + "px";
    }

    if(configsOpen){
        configsPage.style.right = content.getBoundingClientRect().left - 200 + "px";
    } else{
        configsPage.style.right = content.getBoundingClientRect().left + "px";
    }
}
resize()
window.onresize = resize;

// selects
function applySelects(){
    Object.keys(fonts).forEach((key) => {
        let newOption = document.createElement("option");
        newOption.innerHTML = key;
        inputs.Font.appendChild(newOption);
    });
    inputs.Font.value = "maintext";

    Object.keys(sounds).forEach((key) => {
        let newOption = document.createElement("option");
        newOption.innerHTML = key;
        inputs.Sound.appendChild(newOption);
    });
    inputs.Sound.value = "txttor";

    Object.keys(typers).forEach((key) => {
        let newOption = document.createElement("option");
        newOption.innerHTML = "Typer " + key;
        typerSelect.appendChild(newOption);
    });
    typerSelect.value = "Typer 4";
    typerSelect.oninput = () => {
        if(typerSelect.value == "Custom"){
            warning.style.display = "none";
            Object.entries(inputs).forEach((entry) => {
                entry[1].disabled = false;
            })
            if(!configsOpen){
                configsPage.style.right = content.getBoundingClientRect().left - 200 + "px";
                configsOpen = true;
                infoPage.style.right = content.getBoundingClientRect().left + "px";
                infoOpen = false;
            }
            return;
        }

        warning.style.display = "block";
        Object.entries(inputs).forEach((entry) => {
            entry[1].disabled = true;
        })

        let typerNum = parseInt(typerSelect.value.substring(6, typerSelect.value.length));
        let typer = typers[typerNum];
        curTyper.Name = typerNum;

        Object.entries(inputs).forEach((entry) => {
            curTyper[entry[0]] = typer[entry[0]];

            entry[1].value = typer[entry[0]];
            if(entry[0] == "XEnd") entry[1].value -= typer["X"];
        })

        inputDetected();
    }
}

// botões
function play(){
    if(playing){
        stringPos = 0;
        timer = 0;
        return;
    }

    playing = true;
    stringPos = 0;
    timer = 0;

    playLoop = setInterval(() => {
        if(stringPos < textInput.value.length){
            stringPos++;
            sounds[curTyper.Sound].currentTime = 0;
            sounds[curTyper.Sound].play();
        }
        render();
        if(!playing) clearInterval(playLoop);
    }, curTyper.Speed * 33);
}

function stop(){
    if(!playing) return;

    playing = false;
}

function copy(){
    canvas.toBlob(function(blob) { 
        const item = new ClipboardItem({ "image/png": blob });
        navigator.clipboard.write([item]); 
    });
    alert("Imagem copiada para área de transferência.");
}

function download(){
    var image = canvas.toDataURL();
    var aDownloadLink = document.createElement('a');
    aDownloadLink.download = 'sem título.png';
    aDownloadLink.href = image;
    aDownloadLink.click();
}

function popout(){
    let newPopout = (setup.Popout == "true" ? false : true);
    let newLocation = location.href +
        "?Popout=" + newPopout +
        "&Text=" + textInput.value +
        "&BoxType=" + curBoxType +
        "&Typer=" + curTyper.Name +
        "&Face=" + face +
        "&Size=" + size +

        "&Font=" + curTyper.Font +
        "&Color=" + curTyper.Color +
        "&XEnd=" + curTyper.XEnd +
        "&Shake=" + curTyper.Shake +
        "&Speed=" + curTyper.Speed +
        "&Sound=" + curTyper.Sound +
        "&Spacing=" + curTyper.Spacing +
        "&VSpacing=" + curTyper.VSpacing;

    let newWindow;
    if(newPopout){
        console.log("opening popout");
        newWindow = window.open(newLocation, "UT Textbox", "height=420, width=640");
    } else{
        console.log("opening non popout");
        newWindow = window.open(newLocation, "_blank");
    }

    newWindow.focus();
    window.close();
}

function configs(){
    if(configsOpen){
        configsPage.style.right = content.getBoundingClientRect().left + "px";
        configsOpen = false;
    } else{
        configsPage.style.right = content.getBoundingClientRect().left - 200 + "px";
        configsOpen = true;

        infoPage.style.right = content.getBoundingClientRect().left + "px";
        infoOpen = false;
    }
}

function info(){
    if(infoOpen){
        infoPage.style.right = content.getBoundingClientRect().left + "px";
        infoOpen = false;
    } else{
        infoPage.style.right = content.getBoundingClientRect().left - 200 + "px";
        infoOpen = true;

        configsPage.style.right = content.getBoundingClientRect().left + "px";
        configsOpen = false;
    }
}

function checkFace(elem){
    face = elem.checked;
    updateText();
}
function checkSize(){
    size = elem.checked;
    updateText();
}

// popout setup
console.log(window.location.search);
let urlParams = new URLSearchParams(window.location.search);
let setup = {
    "Popout": urlParams.get("Popout"),
    "Text": urlParams.get("text"),
    "BoxType": urlParams.get("BoxType"),
    "Typer": urlParams.get("Typer"),
    "Face": urlParams.get("Face"),
    "Size": urlParams.get("Size"),

    "Font": urlParams.get("Font"),
    "Color": urlParams.get("Color"),
    "XEnd": urlParams.get("XEnd"),
    "Shake": urlParams.get("Shake"),
    "Speed": urlParams.get("Speed"),
    "Sound": urlParams.get("Sound"),
    "Spacing": urlParams.get("Spacing"),
    "VSpacing": urlParams.get("VSpacing"),
}
window.history.replaceState(null, "", location.href.split("?")[0]);

function inputDetected(){
    playing = false;


    // if(face){
    //     ctx.drawImage(faceImg, 39, 31);
    // }

    render();
}
textInput.oninput = inputDetected;