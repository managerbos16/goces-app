const fs = require("fs");
const path = require("path");
const fg = require("fast-glob");
const chokidar = require("chokidar");

const DIST_DIR = "dist";
const OUTPUT_FILE = path.join(DIST_DIR, "goces.min.css");

// Pastikan folder dist ada
if (!fs.existsSync(DIST_DIR)) {
    fs.mkdirSync(DIST_DIR);
}

function minifyCSS(css) {
    return css
        .replace(/\/\*[\s\S]*?\*\//g, "") // hapus komentar
        .replace(/\n/g, "")
        .replace(/\r/g, "")
        .replace(/\t/g, "")
        .replace(/\s{2,}/g, " ")
        .replace(/\s*{\s*/g, "{")
        .replace(/\s*}\s*/g, "}")
        .replace(/\s*:\s*/g, ":")
        .replace(/\s*;\s*/g, ";")
        .replace(/\s*,\s*/g, ",");
}

function buildCSS() {

    const files = fg.sync("css/**/*.css");

    let output = "";

    files.forEach(file => {

        output += fs.readFileSync(file, "utf8") + "\n";

    });

    output = minifyCSS(output);

    fs.writeFileSync(OUTPUT_FILE, output);

    console.clear();

    console.log("======================================");
    console.log("✅ GOCES CSS BUILD BERHASIL");
    console.log("======================================");
    console.log("📄 Total CSS :", files.length);
    console.log("📦 Output    :", OUTPUT_FILE);
    console.log("🕒", new Date().toLocaleTimeString());
    console.log("======================================");

}

buildCSS();

if (process.argv.includes("--watch")) {

    console.log("👀 Watching CSS...");

    chokidar.watch("css").on("change", () => {

        buildCSS();

    });

}