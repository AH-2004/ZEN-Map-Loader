const fs = require('fs');
const {exec} = require('child_process')

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

exports.overwrite_map = overwrite_map
exports.delete_overwrite_maps = delete_overwrite_maps
exports.delete_mods_dir = delete_mods_dir