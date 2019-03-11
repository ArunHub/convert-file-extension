const fs = require('fs');

function readDirectory() {
    return new Promise((resolve, reject) => {
        fs.readdir(__dirname, (err, files) => {
            if (err) {
                reject('retrieve failed-' + "/t" + err);
            }
            let checkedFiles = checkCorrectFiles(files);
            resolve(checkedFiles);
        })
    });
}

function checkCorrectFiles(files) {
    let tempArray = [];
    for (const file of files) {
        const regexFile = file.match(/.+\.js$/g);
        if (regexFile !== null) {
            let fileStr = regexFile[0];
            tempArray.push(fileStr);
        }
    }
    console.log(tempArray);
    return tempArray;
}

function changeExtension(file, extName) {
    let ext = extName ? '.' + extName : '.js';
    return file.replace(/\.js$/g, ext);
}

async function createFiles(dirName, files, extName) {
    for (const file of files) {
        let reading = await readFiles(file);
        let fileExt = changeExtension(file, extName);
        fs.writeFile(`${dirName}/${fileExt}`, reading, (err) => {
            if (err) {
                console.log('error writing data=', err);
            }
            console.log('completed')
        })
    }
}

function readFiles(regexFile) {
    return new Promise((resolve, reject) => {
        fs.readFile(regexFile, (err, data) => {
            if (err) {
                reject(err);
            }
            resolve(data.toString());
        })
    })
}

function getRandomArbitrary() {
    let randomDir = __dirname.slice() + (Math.random() * (10 - 1) + 1).toFixed(2);
    return randomDir;
}

function makeDestDir() {
    return new Promise((resolve, reject) => {
        console.log('mkdir')
        const randomDir = getRandomArbitrary();
        fs.mkdir(randomDir, (err, data) => {
            if (err) {
                reject('create directory failed because ' + err);
            }
            console.log(randomDir + ' created')
            resolve(randomDir);
        })
    })
}

// function writeToDist(reading) {
//     fs.writeFile
// }

async function loopDirectory() {
    const extName = process.argv[2];
    let takenFiles = await readDirectory();
    if (takenFiles.length) {
        let dirName = await makeDestDir();
        let written = await createFiles(dirName, takenFiles, extName);
    }

    fs.readdir(__dirname, { withFileTypes: true }, (err, files) => {
        if (err) {
            console.log('err');
        }
        console.log('files', typeof files);
        // for (const file of files) {
            
        // }

    })
}

loopDirectory();

