// import JSZZip from "./jszip.min/js";
// import("./jszip.min/js")


async function generateZippedProjectree(projectree) {
    projectree = JSON.parse(JSON.stringify(projectree));

    console.log("generating projectree");

    const theme = projectree.project_theme;
    const title = projectree.project_title;
    const favicon = projectree.project_favicon;

    let generatedHTML = "";
    const templateHTML = await readTextFile(`/static/templates/${theme}/index.html`);

    console.log("Reading template html")



    generatedHTML = templateHTML;
    generatedHTML = generatedHTML.replaceAll("<!--project_title-->", title);
    generatedHTML = generatedHTML.replaceAll("<!--project_favicon-->", favicon);
    generatedHTML = generatedHTML.replaceAll("// projectree = {};", `projectree = ${JSON.stringify(projectree)};`);

    const defaultProjectPhoto = await (await fetch(`/static/templates/${theme}/assets/default_project_photo.png`)).blob();
    const twindLib = await readTextFile(`/static/templates/${theme}/libs/twind.umd.js`);
    const twindLibMap = await readTextFile(`/static/templates/${theme}/libs/twind.umd.js.map`);
    // return

    const zip = new JSZip();
    const assetFolder = zip.folder("assets");

    assetFolder.file("default_project_photo.png", defaultProjectPhoto);


    const libsFolder = zip.folder("libs");
    libsFolder.file("twind.umd.js", twindLib);
    libsFolder.file("twind.umd.js.map", twindLibMap);

    console.log("zipping file");

    zip.file("index.html", generatedHTML);

    zip.generateAsync({
        type: "blob",
        compression: "DEFLATE",
        compressionOptions: { level: 9 }
    }).then(file => {
        console.log("downloading file", file)
        downloadFile(file, "Projectree", ".zip");
    });
}

function downloadFile(file, name, extension, cb) {
    const fileName = `${name}-${parseInt(getAccurateDate())}${extension}`;

    const anchor = document.createElement("a");

    anchor.download = fileName;
    anchor.href = URL.createObjectURL(file);
    anchor.click();
    setTimeout(function () { URL.revokeObjectURL(anchor.href) }, 40000);
    if (typeof cb === "function") {
        cb();
    }
}

const startTime = Date.now();
function getAccurateDate() {
    return startTime + performance.now();
}

async function readTextFile(file) {
    const response = await fetch(file);
    const data = await response.text();
    return data;
}

export default generateZippedProjectree;