const fs = require('fs')
const File = require('../models/File')
const path = require('path')

class FileService {

    createDir(file) {

        const filePath = path.resolve('./files', String(file.user), file.path)

        return new Promise((resolve, reject) => {
            try {
                if (!fs.existsSync(filePath)) {
                    fs.mkdirSync(filePath)
                    return resolve({ message: 'Файл создан' })
                } else {
                    return reject({ message: 'Файл уже существует' })
                }

            } catch (e) {
                return reject({ message: 'Ошибка при созданиии папки' })
            }
        })
    }

    deleteFile(file) {
        const filePath = this.getPath(file)

        if (file.type === 'dir') {
            fs.rmdirSync(filePath)
        } else {
            fs.unlinkSync(filePath)
        }
    }

    getPath(file) {
        return path.resolve('./files', String(file.user), file.path)
    }
}

module.exports = new FileService()
