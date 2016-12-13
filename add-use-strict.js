const fs = require('fs');
var glob = require('glob');

function addUseStrict(fileName) {
    if(fs.existsSync(fileName)) {
        var content = fs.readFileSync(fileName);
        content = content.toString();

        // The first char of the file, which is encoded in UTF8-BOM, is '\uFEFF'.
        // So the first char like above should be deleted when you insert content to file's header.
        var firstChar = content[0], withBOM = firstChar === '\uFEFF';
        content = withBOM ? content.substr(1) : content;

        var dataArray = content.split('\n');
        for(var i = 0; i < dataArray.length; i++) {
            dataArray[i] = '    ' + dataArray[i];
        }

        dataArray.splice(0, 0, '(function() {\n    \'use strict\';');

        dataArray.splice(1, 0, '');
        dataArray.push('');
        dataArray.push('}());');

        content = dataArray.join('\n');
        fs.writeFileSync(fileName, content);
    }
}

function processFiles(path) {
    // Like this: C:/text/*.js or C:/main/**/*.js
    var files = glob.sync(path);
    if (files && files.length > 0) {
        files.forEach(function (filepath) {
            if (fs.lstatSync(filepath).isFile()) {
                addUseStrict(filepath);
            }
        })
    }
}

processFiles('../Scripts/*/*.js');