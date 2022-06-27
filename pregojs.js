// npm install 之后先使用
// serve-with-gojs/build-with-gojs
// 对 node_module 中相关的文件进行处理
// 去除开源版本的 gojs 自带的水印

const fs = require('fs')
const path = require('path')
const file_js = path.join(__dirname, './node_modules/gojs/release/go.js')
const file_mjs = path.join(__dirname, './node_modules/gojs/release/go.mjs')
const file_module = path.join(__dirname, './node_modules/gojs/release/go-module.js')

const doReplace = (filePath) => {
    fs.readFile(filePath, 'utf8', function (err, data) {
        if (err) throw err;

        console.log(`[solving] ${filePath}.`)

        let hasMatch = false;

        // old version
        let content = data.replace(/[\w\W]{8}7eba17a4ca3b1a8346[\w\W]{31}/gi, function (match) {
            if(match) hasMatch = true;
            return 'function(){return true;}'
        });

        // new version
        if(!hasMatch){
            content = data.replace(/[^)^{}]*7ca11abfd7330390[^;]*/gi, function (match) {//查找绘制文本的语句
                let arr=/]\(([^,]+)/.exec(match);  // search all target
                return arr && arr.length>=1 && arr[1];
            });
        }

        fs.writeFile(filePath, content, 'utf8', (err) => {
            if (err) {
                console.log(`[error] in ${filePath}: ${err.toString()}.`)
            }
            else {
                console.log(`[success] ${filePath} replaced.`)
            }
        });
    });
}

(() => {
    doReplace(file_js)
    doReplace(file_mjs)
    doReplace(file_module)
})()