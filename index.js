const fs = require('fs');
const path = require('path');

class ConvertFileExt {

    constructor(extName) {
        this.extName = extName;
        this.level = 0;
        this.destPath = ""
    }

    async readSyncSubDir(dirPath, folderList = []) {
        const arrayList = fs.readdirSync(dirPath);
        let directories = [], fileList = [], createdDir = "";
        arrayList.forEach(file => {
            if (this.isDirectory(dirPath, file))
                directories = [...directories, file];
            else
                fileList = [...fileList, file];
        })
        if (fileList.length) {
            if (this.level === 0) {
                this.destPath = await this.makeDestDir(dirPath);
            } else {
                let lastWord = dirPath.split(path.sep);
                lastWord = lastWord[lastWord.length - 1];
                createdDir = await this.makeDestDir(this.destPath + '/' + lastWord);
            }
            await this.createFiles(this.level === 0 ? this.destPath : createdDir, dirPath, fileList).then((res) => {
                console.log('Done!!!');
            });
        }
        if (directories.length) {
            this.level++;
            directories.forEach(folder => {
                folderList = [...folderList, path.join(dirPath, folder)];
                this.readSyncSubDir(path.join(dirPath, folder), folderList);
            });
        }
    }

    isDirectory(dirName, file) {
        return fs.statSync(path.join(dirName, file)).isDirectory();
    }

    changeExtension(file) {
        let ext = this.extName ? '.' + this.extName : '.js';
        return path.extname(file) === ".js" ? file.replace(/\.js$/g, ext) : file;
    }

    async createFiles(dirName, readPath, fileList) {
        for (const file of fileList) {
            let reading = await this.readFiles(readPath, file);
            let fileExt = this.changeExtension(file);
            fs.writeFile(`${dirName}/${fileExt}`, reading, (err) => {
                if (err) {
                    console.log('error writing data=', err);
                }
                console.log('completed')
            })
        }
    }

    readFiles(readPath, regexFile) {
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

    getRandomPath(dirPath) {
        let randomDir = dirPath.slice() + (Math.random() * (10 - 1) + 1).toFixed(2);
        return randomDir;
    }

    makeDestDir(dirPath) {
        return new Promise((resolve, reject) => {
            const randomDir = this.level ? dirPath : this.getRandomPath(dirPath);
            fs.mkdir(randomDir, (err) => {
                if (err) {
                    reject('create directory failed because ' + err);
                }
                resolve(randomDir);
            })
        })
    }
}

// const readSyncSubDir = async (dirPath, extName, folderList = [], level = 0, destPath = "") => {
//     const arrayList = fs.readdirSync(dirPath);
//     let directories = [], fileList = [], createdDir = "";
//     arrayList.forEach(file => {
//         if (isDirectory(dirPath, file))
//             directories = [...directories, file];
//         else
//             fileList = [...fileList, file];
//     })
//     if (fileList.length) {
//         if (level === 0) {
//             destPath = await makeDestDir(dirPath, level);
//         } else {
//             let lastWord = dirPath.split(path.sep);
//             lastWord = lastWord[lastWord.length - 1];
//             createdDir = await makeDestDir(destPath + '/' + lastWord, level);
//         }
//         await createFiles(level === 0 ? destPath : createdDir, dirPath, fileList, extName).then((res) => {
//             console.log('Done!!!');
//         });
//     }
//     if (directories.length) {
//         level++;
//         directories.forEach(folder => {
//             folderList = [...folderList, path.join(dirPath, folder)];
//             readSyncSubDir(path.join(dirPath, folder), extName, folderList, level, destPath);
//         });
//     }
// }

// const isDirectory = (dirName, file) => fs.statSync(path.join(dirName, file)).isDirectory();

// const changeExtension = (file, extName) => {
//     let ext = extName ? '.' + extName : '.js';
//     return path.extname(file) === ".js" ? file.replace(/\.js$/g, ext) : file;
// }

// const createFiles = async (dirName, readPath, fileList, extName) => {
//     for (const file of fileList) {
//         let reading = await readFiles(readPath, file);
//         let fileExt = changeExtension(file, extName);
//         fs.writeFile(`${dirName}/${fileExt}`, reading, (err) => {
//             if (err) {
//                 console.log('error writing data=', err);
//             }
//             console.log('completed')
//         })
//     }
// }

// const readFiles = (readPath, regexFile) => {
//     const newPath = path.join(readPath, regexFile);
//     return new Promise((resolve, reject) => {
//         fs.readFile(newPath, (err, data) => {
//             if (err) {
//                 reject(err);
//             }
//             resolve(String(data));
//         })
//     })
// }

// const getRandomPath = (dirPath) => {
//     let randomDir = dirPath.slice() + (Math.random() * (10 - 1) + 1).toFixed(2);
//     return randomDir;
// }

// const makeDestDir = (dirPath, level) => {
//     return new Promise((resolve, reject) => {
//         const randomDir = level ? dirPath : getRandomPath(dirPath);
//         fs.mkdir(randomDir, (err) => {
//             if (err) {
//                 reject('create directory failed because ' + err);
//             }
//             resolve(randomDir);
//         })
//     })
// }

const convertFile = new ConvertFileExt(process.argv[3]);
convertFile.readSyncSubDir(process.argv[2]).then(res => console.log('All Files are converted'));
// (async function start() {
//     readSyncSubDir(process.argv[2], process.argv[3]);
// })();
