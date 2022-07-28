// import JSZZip from "./jszip.min/js";
// import("./jszip.min/js")


async function generateZippedProjectree(projectree) {
    projectree = JSON.parse(JSON.stringify(projectree));

    projectree.description =  `Generated Projectree for ${projectree.project_title}`

    console.log("Generating projectree");

    const theme = projectree.project_theme;
    const title = projectree.project_title || "Generated Projectree";
    const description = projectree.description || `Generated Projectree for ${title}`;
    const favicon = projectree.project_favicon || "assets/default_16x16_favicon.png";

    const templateHTML = await readTextFile(`/static/templates/${theme}/index.pjtl`);

    let generatedHTML = "";

    console.log("Generating template html");

    generatedHTML = templateHTML;
    generatedHTML = generatedHTML.replaceAll("&lt;!--Projectree-Title--&gt;", title);
    generatedHTML = generatedHTML.replaceAll("&lt;!--Projectree-Description--&gt;", description);
    generatedHTML = generatedHTML.replaceAll("&lt;!--project_favicon--&gt;", favicon);
    generatedHTML = generatedHTML.replace("const projectree = {};", `const projectree = ${JSON.stringify(projectree)};`);

    console.log("Generating Assets");

    const defaultFaviconICO = await readBlobFile(`/static/templates/${theme}/assets/favicon.ico`);
    const defaultFaviconPNG = await readBlobFile(`/static/templates/${theme}/assets/default_16x16_favicon.png`);
    const defaultProjectPhoto = await readBlobFile(`/static/templates/${theme}/assets/default_project_photo.png`);
    const twindLib = await readTextFile(`/static/templates/${theme}/libs/twind.umd.js`);
    const twindLibMap = await readTextFile(`/static/templates/${theme}/libs/twind.umd.js.map`);
    // return

    const zip = new JSZip();
    const assetFolder = zip.folder("assets");

    assetFolder.file("favicon.ico", defaultFaviconICO);
    assetFolder.file("default_16x16_favicon.png", defaultFaviconPNG);
    assetFolder.file("default_project_photo.png", defaultProjectPhoto);


    const libsFolder = zip.folder("libs");
    libsFolder.file("twind.umd.js", twindLib);
    libsFolder.file("twind.umd.js.map", twindLibMap);

    console.log("Bundling file");

    zip.file("index.html", generatedHTML);

    zip.generateAsync({
        type: "blob",
        compression: "DEFLATE",
        compressionOptions: { level: 9 }
    }).then(file => {
        console.log("Downloading Projectree", file)
        downloadFile(file, `Projectree-${title}`, ".zip");
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

async function readBlobFile(file) {
    const response = await fetch(file);
    const data = await response.blob();
    return data;
}

export default generateZippedProjectree;