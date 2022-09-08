function filePath(path) {
    return (req, _, next) => {
        req.filePath = path
        next()
    }
}

module.exports = filePath
