#!/usr/bin/env node

const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')
const fs = require("fs")
const fsWin = require('fswin');
const http = require("http")
const axios = require("axios")
const cheerio = require("cheerio")
const argv = yargs(hideBin(process.argv)).argv

!(async () => {
    let folder = argv.folder

    if (!folder) {
        console.log(`\x1b[43m\x1b[30m[Fejl]\x1b[0m\x1b[33m Du angav ikke noget mappe`);
        return
    }

    let exists = fs.existsSync(folder)

    if (exists) {
        let latest = await axios(`https://runtime.fivem.net/artifacts/fivem/build_server_windows/master/`);
        let $ = await cheerio.load(latest.data);
        let version = ($('.is-primary').text()).replace(/[^0-9.]/g, '')
        let href = $('.is-primary').attr('href') || ""
    
        fs.mkdirSync(folder+'/.frm/cache', {recursive: true})
        fsWin.setAttributesSync(folder+'/.frm/', {IS_HIDDEN: true})
    
        http.get('http://runtime.fivem.net/artifacts/fivem/build_server_windows/master/'+href.replaceAll('./', ''), function(response) {
            response.pipe(fs.createWriteStream(folder+`/.frm/cache/latest_artifact.7z`));
            console.log('Generating "latest_artifact.7z" version ' + version)
        })
    } else {
        console.log(`\x1b[43m\x1b[30m[Fejl]\x1b[0m\x1b[33m Mappen \x1b[4m${folder}\x1b[0m\x1b[33m findes ikke i dette system`)
    }
})()