
const path = require('path')
const fs = require('fs')

const mailBuilder = (fileName)=>{
    const filePath = path.join('public', 'email_templates', fileName)
    const emailFile = fs.readFileSync(filePath, 'utf-8')
    return emailFile
}

module.exports = mailBuilder