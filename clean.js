/* eslint-disable */
const fs = require('fs/promises')
const path = require('path')

const targetFolder = process.argv[2] || 'dist'
const ignorePatterns = [/.gitkeep/]

;(async () => {
    const targetFolderFiles = await fs.readdir(targetFolder)
    const deleteCandidates = targetFolderFiles
        .filter((fileName) => {
            return !ignorePatterns.some((pattern) => fileName.match(pattern))
        })
        .map((fileName) => path.resolve(targetFolder, fileName))
    await Promise.all(
        deleteCandidates.map((fileName) => fs.rm(fileName, { force: true })),
    )
})()
