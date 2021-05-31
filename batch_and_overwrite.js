const fs = require('fs');
const {exec} = require('child_process')

async function batch(arg) {
//Batch code that will be put into file Underpass_overwrite.bat
var batch_code =
`@echo off
echo "%~1" 
echo F|xcopy /y "%~1" "` + arg + `\\TAGame\\CookedPCConsole\\Mods\\Labs_Underpass_P.upk"`
    
fs.writeFileSync('setup\\workshop_files\\Mods\\Underpass_overwrite\\Underpass_overwrite.bat', batch_code)

return;
}

function overwrite_map(selected_mapfile_dir, mods_folder_dir, overwrite_map) {
    exec(`copy "${selected_mapfile_dir}" "${mods_folder_dir}\\${overwrite_map}"`,(err, stdo, stdr) => {
        if (err) console.log(err);
        if(stdo) console.log(stdo);
        if(stdr) console.log(stdr);
    })
}

function delete_overwrite_maps(mods_folder_dir) {
    exec(`del /Q "${mods_folder_dir}\\*.upk"`,(err, stdo, stdr) => {
        if (err) console.log(err);
        if(stdo) console.log(stdo);
        if(stdr) console.log(stdr);
    })
}

function delete_mods_dir(mods_folder_dir) {
    exec(`rmdir /Q /S "${mods_folder_dir}"`,(err, stdo, stdr) => {
        if (err) console.log(err);
        if(stdo) console.log(stdo);
        if(stdr) console.log(stdr);
    })
}

function unload_overwrite_map(mods_folder_dir) {
    //make unload function
}


exports.batch = batch
exports.overwrite_map = overwrite_map
exports.delete_overwrite_maps = delete_overwrite_maps
exports.delete_mods_dir = delete_mods_dir