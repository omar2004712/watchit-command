#!/usr/bin/env node

const chokidar = require('chokidar');
const debounce = require('lodash.debounce');
const program = require('caporal')
const colors = require('colors')
const fs = require('fs')
const {spawn} = require('child_process')

program
    .version('0.0.1')
    .argument('[filename]', 'file to watch')
    .action(async args => {
        const fileName = args['filename'] || 'index.js';
        try{
            await fs.promises.access(fileName);
        } catch (err){
            throw new Error (`could not find ${fileName} in current working directory`)
        }
        let proc;
        const start = debounce( () => {
            if(proc){
                proc.kill();
                console.log('>>>> Change deteced...'.bold.italic.cyan)
            }
            else{
                console.log('>>>> Starting Process...'.bold.italic.cyan)
            }
            proc = spawn('node', [ fileName ], { stdio: 'inherit' });
        }, 100);
        chokidar.watch('.')
        .on('add', start)
        .on('change', start)
        .on('unlink', start)
    })


program.parse(process.argv)
