const fs = require('fs')
const path = require('path')

class FileService {
    createDir(req, file) {
        const filePath = this.getPath(req, file)

        return new Promise((resolve, reject) => {
            try {
                if (!fs.existsSync(filePath)) {
                    fs.mkdirSync(filePath)
                    return resolve({ message: 'Файл создан' })
                } else {
                    return reject({ message: 'Файл уже существует' })
                }
            } catch (e) {
                return reject({ message: 'Ошибка при созданиии папки', e })
            }
        })
    }

    deleteFile(req, file) {
        const filePath = this.getPath(req, file)

        if (file.type === 'dir') {
            fs.rmdirSync(filePath)
        } else {
            fs.unlinkSync(filePath)
        }
    }

    getPath(req, file) {
        return path.join(req.filePath, String(file.user), file.path)
    }
}

module.exports = new FileService()
