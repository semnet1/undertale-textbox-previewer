function render(){
    drawBox();
    printText(fonts[curTyper.Font], textInput.value, 28+(face*116), 20, curTyper.Color, curTyper.Shake);
}

function drawBox(){
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.beginPath();
    ctx.lineWidth = "6";
    ctx.strokeStyle = "#fff";
    ctx.rect(3, 3, 572, 146);
    ctx.stroke();
}

function printText(font, text, x, y, color, shake){
    let stringEnd = "\"";
    let Xoffset = 0;
    let Yoffset = 0;

    let charactersToRender = (playing) ? stringPos : text.length;

    for(let i = 0; i < charactersToRender; i++){
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
        if(text[i] == stringEnd){
            while(text[i] && text[i] != "+") i++;
            while(text[i] && text[i] != "\"" && text[i] != "\'") i++;
            if(text[i]) stringEnd = text[i];
            continue;
        };

        if(x+Xoffset > 548){
            Xoffset = 0;
            Yoffset += 36;
        }

        let character = text[i];
        if(!character) return
        let characterInfo = fonts[curTyper.Font].characters[character.charCodeAt(0)];

        if(curTyper.Font == "papyrus"){
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
        if(playing){
            ctx.drawImage(font.image, characterInfo[0], characterInfo[1], characterInfo[2], characterInfo[3], (x+Xoffset+(characterInfo[5]*2) + (Math.random()*shake - (shake / 2))), (y+Yoffset + (Math.random()*shake - (shake / 2))), characterInfo[2]*2, characterInfo[3]*2);
        } else{
            ctx.drawImage(font.image, characterInfo[0], characterInfo[1], characterInfo[2], characterInfo[3], x+Xoffset+(characterInfo[5]*2), y+Yoffset, characterInfo[2]*2, characterInfo[3]*2);
        }

        ctx.globalCompositeOperation = "destination-over";
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.globalCompositeOperation = "source-over";

        if(curTyper.Font == "comicsans"){
            if (character == "w") Xoffset += 4;
            if (character == "m") Xoffset += 4;
            if (character == "i") Xoffset -= 4;
            if (character == "l") Xoffset -= 4;
            if (character == "s") Xoffset -= 2;
            if (character == "j") Xoffset -= 2;
        }
        if(curTyper.Font == "papyrus"){
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
        Xoffset += curTyper.Spacing*2;
    }

    return Yoffset;
}