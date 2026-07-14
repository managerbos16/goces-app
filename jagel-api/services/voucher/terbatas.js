const data = require("./data");

module.exports = data.filter(v =>

    v.category.includes("terbatas")

);