const fs = require('fs');
const path = require('path');

async function readSyncSubDir(dirPath, folderList = []) {
    const arrayList = fs.readdirSync(dirPath);
    let directories = [], fileList = [];
    arrayList.forEach(file => {
        if (isDirectory(dirPath, file))
            directories = [...directories, file];
        else
            fileList = [...fileList, file];
    })
    if (directories.length) {
        directories.forEach(folder => {
            folderList = [...folderList, path.join(dirPath, folder)];
            readSyncSubDir(path.join(dirPath, folder), folderList);
        });
    }
    if (fileList.length) {
        const createdDir = await makeDestDir(dirPath);
        await createFiles(createdDir, dirPath, fileList, 'jsx').then((res) => {
            console.log('res', res);
        });
    }
}

const isDirectory = (dirName, file) => fs.statSync(path.join(dirName, file)).isDirectory();

function changeExtension(file, extName) {
    let ext = extName ? '.' + extName : '.js';
    return file.substr(-3) === ".js" ? file.replace(/\.js$/g, ext) : file;
}

async function createFiles(dirName, readPath, fileList, extName) {
    for (const file of fileList) {
        let reading = await readFiles(readPath, file);
        let fileExt = changeExtension(file, extName);
        fs.writeFile(`${dirName}/${fileExt}`, reading, (err) => {
            if (err) {
                console.log('error writing data=', err);
            }
            console.log('completed')
        })
    }
}

function readFiles(readPath, regexFile) {
    const newPath = path.join(readPath, regexFile);
    return new Promise((resolve, reject) => {
        fs.readFile(newPath, (err, data) => {
            if (err) {
                reject(err);
            }
            resolve(String(data));
        })
    })
}

function getRandomArbitrary(dirPath) {
    let randomDir = dirPath.slice() + (Math.random() * (10 - 1) + 1).toFixed(2);
    return randomDir;
}

function makeDestDir(dirPath) {
    return new Promise((resolve, reject) => {
        const randomDir = getRandomArbitrary(dirPath);
        fs.mkdir(randomDir, (err) => {
            if (err) {
                reject('create directory failed because ' + err);
            }
            resolve(randomDir);
        })
    })
}

readSyncSubDir(__dirname);
