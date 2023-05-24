console.log(window.location.search);
let urlParams = new URLSearchParams(window.location.search);
let setup = {
    "text": urlParams.get("text"),
    "font": urlParams.get("font"),
    "face": urlParams.get("face"),
    "size": urlParams.get("size"),
    "popup": urlParams.get("popup")
}
console.log(setup);
window.history.replaceState(null, "", location.href.split("?")[0]);

let curFont;

let canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

ctx.fillStyle = "#000";
ctx.fillRect(0, 0, canvas.width, canvas.height);

ctx.beginPath();
ctx.lineWidth = "6";
ctx.strokeStyle = "#ffffff";
ctx.rect(3, 3, 572, 146);
ctx.stroke();

let fonts = {};
async function getFonts(){
    let names = [
        "comicsans",
        "curs",
        "dmg",
        "main",
        "maintext_2",
        "maintext",
        "papyrus",
        "plain",
        "plainbig",
        "small",
        "wingdings"
    ]
    for(let i = 0; i < names.length; i++){
        fonts[names[i]] = {};
        fonts[names[i]].name = names[i];

        let textFile = await fetch("fonts/glyphs_fnt_"+ names[i] +".txt");
        fonts[names[i]].text = await textFile.text();

        let imageFile = new Image();
        imageFile.src = "fonts/fnt_"+ names[i] +".png";
        fonts[names[i]].image = imageFile;

        let characters = {};
        let tempArray = fonts[names[i]].text.split(/\r\n/);
        for(let i = 1; i < tempArray.length; i++){
            let subTempArray = tempArray[i].split(/;/);
            let character = subTempArray.shift()
            characters[character] = subTempArray;
        }
        fonts[names[i]].characters = characters;
    }

    curFont = fonts.maintext;
    if(setup.font) curFont = fonts[setup.font];

    updateText();
}
getFonts()

function printText(font, text, x, y){
    let color = "#FFF";
    let Xoffset = 0;
    let Yoffset = 0;
    for(let i = 0; i < text.length; i++){
        if(text[i] == "&"){
            Xoffset = 0;
            Yoffset += 36;
            i++;
        }
        if(text[i] == "^") i+=2;
        if(text[i] == "\\"){
            if(text[i+1] == "R") color = "#FF0000";
            if(text[i+1] == "G") color = "#00FF00";
            if(text[i+1] == "W") color = "#FFFFFF";
            if(text[i+1] == "Y") color = "#FFFF00";
            if(text[i+1] == "X") color = "#000000";
            if(text[i+1] == "B") color = "#0000FF";
            if(text[i+1] == "O") color = "#FFA040";
            if(text[i+1] == "L") color = "#FFA914";
            if(text[i+1] == "P") color = "#FF00FF";
            if(text[i+1] == "p") color = "#D4BBFF";

            i+=2;
        }
        if(text[i] == "/") i+=1;
        while(text[i] == "%"){
            i++;
        }

        let character = text[i];
        if(!character) return
        let characterInfo = font.characters[character.charCodeAt(0)];

        if(curFont == fonts.papyrus){
            if(character == "l") Xoffset += 4;
            if(character == "i") Xoffset += 4;
            if(character == "I") Xoffset += 4;
            if(character == "!") Xoffset += 4;
            if(character == ".") Xoffset += 4;
            if(character == "S") Xoffset += 2;
            if(character == "?") Xoffset += 4;
            if(character == "D") Xoffset += 2;
            if(character == "A") Xoffset += 2;
            if(character == "'") Xoffset += 2;
        }

        ctx.imageSmoothingEnabled = false;

        if(size){
            ctx.beginPath();
            ctx.lineWidth = "1";
            ctx.strokeStyle = "#ff0000";
            ctx.rect(x+Xoffset+0.5, y+Yoffset+0.5, characterInfo[2]*2-1, characterInfo[3]*2-1)
            ctx.stroke();
        }

        ctx.globalCompositeOperation = "destination-out";
        ctx.drawImage(font.image, characterInfo[0], characterInfo[1], characterInfo[2], characterInfo[3], x+Xoffset+(characterInfo[5]*2), y+Yoffset, characterInfo[2]*2, characterInfo[3]*2);

        ctx.globalCompositeOperation = "destination-over";
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.globalCompositeOperation = "source-over";

        if(curFont == fonts.comicsans){
            if (character == "w") Xoffset += 4;
            if (character == "m") Xoffset += 4;
            if (character == "i") Xoffset -= 4;
            if (character == "l") Xoffset -= 4;
            if (character == "s") Xoffset -= 2;
            if (character == "j") Xoffset -= 2;
        }
        if(curFont == fonts.papyrus){
            if(character == "D") Xoffset += 2;
            if(character == "Q") Xoffset += 6;
            if(character == "M") Xoffset += 2;
            if(character == "L") Xoffset -= 2;
            if(character == "K") Xoffset -= 2;
            if(character == "C") Xoffset += 2;
            if(character == ".") Xoffset -= 6;
            if(character == "!") Xoffset -= 6;
            if(character == "O") Xoffset += 4;
            if(character == "W") Xoffset += 4;
            if(character == "I") Xoffset -= 12;
            if(character == "T") Xoffset -= 2;
            if(character == "P") Xoffset -= 4;
            if(character == "R") Xoffset -= 4;
            if(character == "A") Xoffset += 2;
            if(character == "H") Xoffset += 2;
            if(character == "B") Xoffset += 2;
            if(character == "G") Xoffset += 2;
            if(character == "F") Xoffset -= 2;
            if(character == "?") Xoffset -= 6;
            if(character == "'") Xoffset -= 12;
            if(character == "J") Xoffset -= 2;
            Xoffset += 6;
        }
        Xoffset += 16;

        if(x+Xoffset > 550){
            Xoffset = 0;
            Yoffset += 36;
        }
    }

    return Yoffset;
}

let textBox = document.getElementById("textBox");
textBox.value = setup.text;
let faceImg = new Image();
faceImg.src = "img/Rosto.png";
let face = (setup.face == "true");
let size = (setup.size == "true");
function updateText(){
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.beginPath();
    ctx.lineWidth = "6";
    ctx.strokeStyle = "#fff";
    ctx.rect(3, 3, 572, 146);
    ctx.stroke();

    if(face){
        ctx.drawImage(faceImg, 39, 31);
    }

    printText(curFont, textBox.value, 28+(face*116), 20);
}
textBox.oninput = updateText;

let btnNormal = document.getElementById("btnNormal");
btnNormal.onclick = () => {
    curFont = fonts.maintext;
    updateText()
}
let btnSans = document.getElementById("btnSans");
btnSans.onclick = () => {
    curFont = fonts.comicsans;
    updateText()
}
let btnPapyrus = document.getElementById("btnPapyrus");
btnPapyrus.onclick = () => {
    curFont = fonts.papyrus;
    updateText()
}

let checkFace = document.getElementById("checkFace");
checkFace.checked = (setup.face == "true");
checkFace.oninput = () => {
    face = checkFace.checked;
    updateText();
}
let checkSize = document.getElementById("checkSize");
checkSize.checked = (setup.size == "true");
checkSize.oninput = () => {
    size = checkSize.checked;
    updateText();
}

function popup() {
    let newPopup = (setup.popup == "true" ? false : true);
    let newLocation = location.href+"?text="+textBox.value+"&font="+curFont.name+"&face="+checkFace.checked+"&size="+checkSize.checked+"&popup="+newPopup;

    let newWindow;
    if(newPopup){
        console.log("opening popup");
        newWindow = window.open(newLocation, "UT Textbox", "height=370, width=650");
    } else{
        console.log("opening non-popup");
        newWindow = window.open(newLocation, "_blank");
    }
    newWindow.focus();

    window.close();
}