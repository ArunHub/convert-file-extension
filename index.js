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
            // await this.createStreamFiles(this.level === 0 ? this.destPath : createdDir, dirPath, fileList).then((res) => {
            //     console.log('Done!!!');
            // });
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

    // async createStreamFiles(dirName, readPath, fileList) {
    //     for (const file of fileList) {
    //         let fileExt = this.changeExtension(file);
    //         const newPath = path.join(readPath, file);
    //         this.writerStream(`${dirName}/${fileExt}`, newPath);
    //     }
    // }

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

    readerStream(filename) {
        const reader = fs.createReadStream(filename);
        let chunks = [];

        reader.on('data', (chunk) => { chunks.push(chunk) });

        reader.on('close', () => chunks.push(null));

        reader.on('error', (err) => { return cb(err) });

        return reader;
    }

    writerStream(writeToFile, readFile) {
        const writer = fs.createWriteStream(writeToFile);

        let readable = this.readerStream(readFile);

        readable.pipe(writer);

        writer.on('data', () => { console.log('data written') });
        writer.on('error', (err) => { throw err });
        writer.on('close', () => console.log('writing done!!'));
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

const convertFile = new ConvertFileExt(process.argv[3]);
convertFile.readSyncSubDir(process.argv[2]).then(res => console.log('All Files are converted'));
