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
        tempArray.forEach((i) => {
            let subTempArray = i.split(/;/);
            let character = subTempArray.shift();
            characters[character] = subTempArray;
        });
        fonts[names[i]].characters = characters;
    };
}

let sounds = {};
async function getSounds(){
    let names = [
        "floweytalk1",
        "floweytalk2",
        "mtt1",
        "nosound",
        "tem",
        "TXT1",
        "TXT2",
        "txtal",
        "txtasg",
        "txtasr",
        "txtasr2",
        "txtpap",
        "txtsans",
        "txttor",
        "txttor2",
        "txtund_hyper",
        "txtund",
        "txtund2",
        "txtund3",
        "txtund4",
        "wngdng1",
    ]

    names.forEach((i) => {
        sounds[i] = new Audio("sounds/"+i+".wav");
    });
}

async function loadAssets(){
    await getFonts();
    await getSounds();
}

loadAssets().then(() => {
    applySelects();
    document.getElementById("loadingScreen").style.opacity = 0;
    document.getElementById("loadingScreen").style.pointerEvents = "none";
    inputDetected();
});