const fs = require('fs') // 引入 fs 模組
const { ImgurClient } = require('imgur')
const client = new ImgurClient({
  clientId: process.env.IMGUR_CLIENT_ID,
  clientSecret: process.env.IMGUR_CLIENT_SECRET,
  refreshToken: process.env.IMGUR_REFRESH_TOKEN
})

const localFileHandler = file => { // file 是 multer 處理完的檔案
  return new Promise((resolve, reject) => {
    if (!file) return resolve(null)
    const fileName = `upload/${file.originalname}`
    return fs.promises.readFile(file.path)
      .then(data => fs.promises.writeFile(fileName, data))
      .then(() => resolve(`/${fileName}`))
      .catch(err => reject(err))
  })
}

// imgur v1.0.2
/*
const imgurFileHandler = file => {
  return new Promise((resolve, reject) => {
    if (!file) return resolve(null)
    return imgur.uploadFile(file.path)
      .then(img => {
        resolve(img?.link || null) // 檢查 img 是否存在
      })
      .catch(err => reject(err))
  })
}
*/

// v2.4.2
const imgurFileHandler = file => {
  if (!file) return null
  // 獲取上傳的圖片
  const imagePath = file.path

  // 讀取圖片並轉換為 base64
  const imageData = fs.readFileSync(imagePath, { encoding: 'base64' })

  return client.upload({
    image: imageData,
    type: 'base64',
    album: process.env.IMGUR_ALBUM_ID
  })
    .then(response => {
      return (response.data?.link || null)
    })
    .catch(err => console.log(err))
}

module.exports = {
  localFileHandler,
  imgurFileHandler
}
