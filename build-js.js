const fs = require("fs");
const path = require("path");
const fg = require("fast-glob");
const chokidar = require("chokidar");

const DIST = "dist";
const OUTPUT = path.join(DIST, "goces.min.js");

if (!fs.existsSync(DIST)) {
    fs.mkdirSync(DIST);
}

// File yang HARUS dimuat paling awal
const priority = [
    "js/router.js",
    "js/navigation.js",
    "js/feedback.js",
    "js/app.js"
];

function build() {

    // Cari semua file JS
    let files = fg.sync([
        "js/**/*.js",
        "kuliner.js"
    ]);

    // Hilangkan file prioritas dari hasil scan
    files = files.filter(file => !priority.includes(file));

    // Gabungkan
    files = [...priority, ...files];

    let output = "";

    let total = 0;

    files.forEach(file => {

        if (!fs.existsSync(file)) return;

        output += `\n\n/* ${file} */\n\n`;

        output += fs.readFileSync(file, "utf8");

        total++;

    });

    fs.writeFileSync(OUTPUT, output);

    console.clear();

    console.log("=======================================");
    console.log("🚀 GOCES BUILD SYSTEM");
    console.log("=======================================");
    console.log("✅ JavaScript Build Success");
    console.log("📄 Total JS :", total);
    console.log("📦 Output :", OUTPUT);
    console.log("🕒", new Date().toLocaleTimeString());
    console.log("=======================================");

}

build();

if (process.argv.includes("--watch")) {

    chokidar.watch([
        "js",
        "kuliner.js"
    ], {
        ignoreInitial: true
    }).on("all", () => {

        build();

    });

    console.log("👀 Watching JavaScript...");

}