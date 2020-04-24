const fs = require("fs");
const writeToFile = (filename, jsonData) => {
    fs.writeFile(filename, JSON.stringify(jsonData), "utf8", () => {
        console.log("_____DONE____");
    });
};


/**
 *
 * @param {*} data
 * @param {*} field
 * group by field and return count
 */

const groupBy = (data, field) => {
    let result = data.reduce(function(r, a) {
        r[a[field]] = r[a[field]] || 0;
        r[a[field]] = r[a[field]] + 1;
        return r;
    }, Object.create(null));
    return result;
};

module.exports = {
    writeToFile,
    groupBy
};
