const {app,ipcMain, BrowserWindow} = require('electron');
const fs = require('fs');
const {exec} = require('child_process');
const path = require('path');
const winstate = require('electron-window-state');
const OpenDialog = require('./OpenDialog.js');
const Overwrite = require('./Overwrite.js');

var win;
var win2;
var win3;
var custom_maps_folder_string;
var custom_maps_folder_canceled_string;
var selected_mapfile_dir;
var file_list;
var exists;
var custom_maps_folder_directory;
var rocket_league_dir;


function createWindow(x, y) {
    win = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
        width: 400,
        height: 225,
        x: x,
        y: y,
        icon: "Assets/icons/win/icon.ico"
    })
    //win.openDevTools({ detach: true });
    win.setResizable(false)
    win.removeMenu(true)
    win.loadFile('render\\index.html') 
}

function createWindow2(x, y) {

    if(!win2) {
        win2 = new BrowserWindow({
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false,
            },
            width: 400,
            height: 225,
            x: x,
            y: y,
            icon: "Assets/icons/win/icon.ico"
        })
        //win2.openDevTools({ detach: true });
        win2.setResizable(false)
        win2.removeMenu(true)
        win2.loadFile('render\\index2.html')

        win2.on('close', function (event) {
            win2=null
        })
    } else {
        if (win2.isMinimized()) win2.restore()
        win2.focus()
    }
}

function createWindow3(x, y) {
    if (!win3) {
        win3 = new BrowserWindow({
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false,
            },
            width: 400,
            height: 225,
            x: x,
            y: y,
            icon: "Assets/icons/win/icon.ico"
    })
        //win3.openDevTools({ detach: true });
        win3.setResizable(false)
        win3.removeMenu(true)
        win3.loadFile('render\\index3.html')

        win3.on('close', function () {
            win3=null
        })
    } else {
        if (win3.isMinimized()) win3.restore()
        win3.focus()
    }
}

const gotTheLock = app.requestSingleInstanceLock()

if (!gotTheLock) {
    app.quit()
} else {
    app.on('second-instance', () => {

        if (win) {
            if (win.isMinimized()) win.restore()
            win.focus()
        }
    })
    
    app.whenReady().then(() => {
        let windowstate = winstate();

        createWindow(windowstate.x, windowstate.y);
        windowstate.manage(win)
        app.on('activate', () => {
            if (BrowserWindow.getAllWindows().length === 0) {        
                createWindow();
            }
        }) 
    })
}

app.on('window-all-closed', () => {
    if(process.platform !== 'darwin'){
        app.quit();
    }
});

ipcMain.on("auto_list_grab", function(event) {
    if (fs.existsSync('./config.json')) {
        let read_json = JSON.parse(fs.readFileSync('./config.json', 'utf8')); 
        custom_maps_folder_directory = read_json.custom_maps_folder_directory
        rocket_league_directory = read_json.rocket_league_directory
        let loaded = read_json.loaded

        if (read_json.setup_run === Boolean(false)) {
            console.log('setup not run');
        } else {
            if (read_json.custom_maps_folder_directory === null) {
                console.log('setup not run');
            } else {
                if (fs.existsSync(rocket_league_directory + '\\TAGame\\CookedPCConsole\\mods')) {
                    fs.readdir(custom_maps_folder_directory, function (err, files) {
                        if (err) {console.log(err)};
                        file_list = files.filter(el => path.extname(el) === '.udk')
                        let array_to_string = file_list.toString();
                        let edit_array = array_to_string.replace(/.udk/g, '');
                        let string_to_array = edit_array.split(',');
        
                        event.sender.send('async-reply', string_to_array);

                        if (loaded === Boolean(true)) {
                            let sendloaded = "Loaded"
                            win.webContents.send('Loaded_msg', sendloaded)
                        } else {
                            if (loaded === Boolean(false)) {
                                let sendUnloaded = "Unloaded"
                                win.webContents.send('Loaded_msg', sendUnloaded)
                            } else {
                                if (loaded === null) {
                                    let sendNull = null
                                    win.webContents.send('Loaded_msg', sendNull)
                                }
                            }
                        }
                    })
                } else {
                    console.log('No mods directory');
                }
            }
        }  
    } else {
        console.log('no config.json');
    }
})

async function rl_dir_dialog() {
    let dir = await OpenDialog.OpenDialog2()
    const rldir = dir[0]
    const rldir_canceled = dir[1]
    rocket_league_canceled = String(rldir_canceled)
    rocket_league_dir = String(rldir)

    const json_canceled_output = {
        rocket_league_directory: null,
        custom_maps_folder_directory: null,
        setup_run: Boolean(false),
        loaded: Boolean(false),
        hamachi: Boolean(false),
        Current_map: null,
        bakkesmod: null,
        Window_position: null
    };

    const json_output = { 
        rocket_league_directory: rocket_league_dir,
        custom_maps_folder_directory: rocket_league_dir + "\\TAGame\\CookedPCConsole\\mods\\Custom_maps",
        setup_run: Boolean(true),
        loaded: Boolean(false),
        hamachi: Boolean(false),
        Current_map: null,
        bakkesmod: null,
        Window_position: null
    };

    if (rocket_league_canceled === 'false') {
        fs.writeFileSync('config.json', JSON.stringify(json_output, null, 2));
    } else {
        fs.writeFileSync('config.json', JSON.stringify(json_canceled_output, null, 2));
        console.log('Canceled OpenDialog2');
    }
    
    return rocket_league_dir;
}

ipcMain.on("Browse_button_click",async function (event) {
    if (fs.existsSync('./config.json')) {
        let dir = await OpenDialog.OpenDialog1()
        const custom_maps_folder = dir[0]
        const custom_maps_folder_canceled = dir[1]
        custom_maps_folder_string = String(custom_maps_folder)
        custom_maps_folder_canceled_string = String(custom_maps_folder_canceled)

        if (custom_maps_folder_canceled_string === 'false') {
            custom_maps_folder_directory = custom_maps_folder_string
            let read_json = JSON.parse(fs.readFileSync('./config.json', 'utf8'));
            read_json.custom_maps_folder_directory = custom_maps_folder_string;

            fs.writeFileSync('config.json', JSON.stringify(read_json, null, 2));

            fs.readdir(custom_maps_folder_string, function (err, files) {
                if (err) {console.log(err);}

                file_list = files.filter(el => path.extname(el) === '.udk')
                let array_to_string = file_list.toString();
                let edit_array = array_to_string.replace(/.udk/g, '');
                let string_to_array = edit_array.split(',');
                event.sender.send('async-reply', string_to_array);
            })
        } else {
            console.log("Canceled OpenDialog1");

            if (fs.existsSync('./config.json')) {
                let read_json = JSON.parse(fs.readFileSync('./config.json', 'utf8')); 
                custom_maps_folder_directory = read_json.custom_maps_folder_directory
                fs.readdir(custom_maps_folder_directory, function (err, files) {
                    if (err) {console.log(err)};
                    file_list = files.filter(el => path.extname(el) === '.udk')
                    let array_to_string = file_list.toString();
                    let edit_array = array_to_string.replace(/.udk/g, '');
                    let string_to_array = edit_array.split(',');
                    event.sender.send('async-reply', string_to_array);
                })
            }
        }
    } else {
        console.log('no config.json');
    }
})

ipcMain.on("Setup_button_click", function (event) {
    if (fs.existsSync('./config.json') && fs.existsSync(rocket_league_directory + '\\TAGame\\CookedPCConsole\\mods')) {
        let read_json = JSON.parse(fs.readFileSync('./config.json', 'utf8'));
        
        if (read_json.setup_run === false) {
            console.log('config.json found: Running setup again');
            const default_dir_epic = "C:\\Program Files\\Epic Games\\rocketleague"
            const default_dir_steam = "C:\\Program Files (x86)\\Steam\\steamapps\\common\\rocketleague"
        
            if(fs.existsSync(default_dir_epic)) {
                exists = Boolean(true)
                rocket_league_dir = default_dir_epic
                const json_output = { 
                    rocket_league_directory: default_dir_epic,
                    custom_maps_folder_directory: default_dir_epic + "\\TAGame\\CookedPCConsole\\mods\\Custom_maps",
                    setup_run: Boolean(true),
                    loaded: Boolean(false),
                    hamachi: Boolean(false),
                    Current_map: null,
                    bakkesmod: null,
                    Window_position: null
                };
                fs.writeFileSync('config.json', JSON.stringify(json_output, null, 2));
            } else {
                if(fs.existsSync(default_dir_steam)) {
                    exists = Boolean(true)
                    rocket_league_dir = default_dir_steam
                    const json_output = { 
                        rocket_league_directory: default_dir_steam,
                        custom_maps_folder_directory: default_dir_steam + "\\TAGame\\CookedPCConsole\\mods\\Custom_maps",
                        setup_run: Boolean(true),
                        loaded: Boolean(false),
                        hamachi: Boolean(false),
                        Current_map: null,
                        bakkesmod: null,
                        Window_position: null
                    };
                    fs.writeFileSync('config.json', JSON.stringify(json_output, null, 2));
                } else {
                    exists = Boolean(false)
                    console.log('Default initial setup failed: running manual setup');
                }
            }
                    
            if (exists === false) {
                async function rl_dir_replace() {
                    rocket_league_dir = await rl_dir_dialog();
                    
                    const read_json = JSON.parse(fs.readFileSync('./config.json'))
                    rocket_league_dir = (read_json.rocket_league_directory)
                    custom_maps_folder_directory = (read_json.custom_maps_folder_directory)
                
                    if (rocket_league_dir === null) {
                        console.log("Unable to copy files");
                    } else {
                        exec(`xcopy /e /y "setup\\workshop_files" "${rocket_league_dir}/TAGame/CookedPCConsole"`,(err, stdo, stdr) => {
                            if(err) {
                                console.log(err);
                                console.log("error overwriting");
                            } else {
                                fs.readdir(custom_maps_folder_directory, function (err, files) {
                                    if (err) {console.log(err)};
                                    file_list = files.filter(el => path.extname(el) === '.udk')
                                    let array_to_string = file_list.toString();
                                    let edit_array = array_to_string.replace(/.udk/g, '');
                                    let string_to_array = edit_array.split(',');
                                    event.sender.send('async-reply', string_to_array);
                                })
                            }
                            if(stdo) console.log(stdo);
                            if(stdr) console.log(stdr);
                        })
                    }
                }
                rl_dir_replace();
            } else {
                if (exists === true) {
                    async function rl_dir() {
                        custom_maps_folder_directory = rocket_league_dir + "\\TAGame\\CookedPCConsole\\mods\\Custom_maps"
                    
                        exec(`xcopy /e /y "setup\\workshop_files" "${rocket_league_dir}\\TAGame\\CookedPCConsole"`,(err, stdo, stdr) => {
                            if(err) {
                                console.log(err);
                                console.log("error overwriting");
                            } else {
                                fs.readdir(custom_maps_folder_directory, function (err, files) {
                                    if (err) {console.log(err)};
                                    file_list = files.filter(el => path.extname(el) === '.udk')
                                    let array_to_string = file_list.toString();
                                    let edit_array = array_to_string.replace(/.udk/g, '');
                                    let string_to_array = edit_array.split(',');
                                    event.sender.send('async-reply', string_to_array);
                                })
                            }
                            if(stdo) console.log(stdo);
                            if(stdr) console.log(stdr);
                        })
                    }
                    rl_dir();
                } else {
                    console.log('Something went wrong...');
                }
            }
        } else {
            console.log('config.json found: setup has already ran');
        }
    } else {
        console.log('no config.json or no mods folder: running setup');
        const default_dir_epic = "C:\\Program Files\\Epic Games\\rocketleague"
        const default_dir_steam = "C:\\Program Files (x86)\\Steam\\steamapps\\common\\rocketleague"
    
        if(fs.existsSync(default_dir_epic)) {
            exists = Boolean(true)
            rocket_league_dir = default_dir_epic
            const json_output = { 
                rocket_league_directory: default_dir_epic,
                custom_maps_folder_directory: default_dir_epic + "\\TAGame\\CookedPCConsole\\mods\\Custom_maps",
                setup_run: Boolean(true),
                loaded: Boolean(false),
                hamachi: Boolean(false),
                bakkesmod: Boolean(false),
                Current_map: null,
                bakkesmod: null,
                Window_position: null
            };
            fs.writeFileSync('config.json', JSON.stringify(json_output, null, 2));
        } else {
            if(fs.existsSync(default_dir_steam)) {
                exists = Boolean(true)
                rocket_league_dir = default_dir_steam
                const json_output = { 
                    rocket_league_directory: default_dir_steam,
                    custom_maps_folder_directory: default_dir_steam + "\\TAGame\\CookedPCConsole\\mods\\Custom_maps",
                    setup_run: Boolean(true),
                    loaded: Boolean(false),
                    hamachi: Boolean(false),
                    bakkesmod: Boolean(false),
                    Current_map: null,
                    bakkesmod: null,
                    Window_position: null
                };
                fs.writeFileSync('config.json', JSON.stringify(json_output, null, 2));
            } else {
                exists = Boolean(false)
                console.log('Default initial setup failed: running manual setup');
            }
        }
                
        if (exists === false) {
            async function rl_dir_replace() {
                rocket_league_dir = await rl_dir_dialog();
                
                const read_json = JSON.parse(fs.readFileSync('./config.json'))
                rocket_league_dir = (read_json.rocket_league_directory)
                custom_maps_folder_directory = (read_json.custom_maps_folder_directory)
            
                if (rocket_league_dir === null) {
                    console.log("Unable to copy files");
                } else {
                    exec(`xcopy /e /y "setup\\workshop_files" "${rocket_league_dir}/TAGame/CookedPCConsole"`,(err, stdo, stdr) => {
                        if(err) {
                            console.log(err);
                            console.log("error overwriting");
                        } else {
                            fs.readdir(custom_maps_folder_directory, function (err, files) {
                                if (err) {console.log(err)};
                                file_list = files.filter(el => path.extname(el) === '.udk')
                                let array_to_string = file_list.toString();
                                let edit_array = array_to_string.replace(/.udk/g, '');
                                let string_to_array = edit_array.split(',');
                                event.sender.send('async-reply', string_to_array);
                            })
                        }
                        if(stdo) console.log(stdo);
                        if(stdr) console.log(stdr);
                    })
                }
            }
            rl_dir_replace();
        } else {
            if (exists === true) {
                async function rl_dir() {
                    custom_maps_folder_directory = rocket_league_dir + "\\TAGame\\CookedPCConsole\\mods\\Custom_maps"
                
                    exec(`xcopy /e /y "setup\\workshop_files" "${rocket_league_dir}\\TAGame\\CookedPCConsole"`,(err, stdo, stdr) => {
                        if(err) {
                            console.log(err);
                            console.log("error overwriting");
                        } else {
                            fs.readdir(custom_maps_folder_directory, function (err, files) {
                                if (err) {console.log(err)};
                                file_list = files.filter(el => path.extname(el) === '.udk')
                                let array_to_string = file_list.toString();
                                let edit_array = array_to_string.replace(/.udk/g, '');
                                let string_to_array = edit_array.split(',');
                                event.sender.send('async-reply', string_to_array);
                            })
                        }
                        if(stdo) console.log(stdo);
                        if(stdr) console.log(stdr);
                    })
                }
                rl_dir();
            }
        }
    }

})

ipcMain.on("Load_btn_click", function (event, arg, arg2) {
    if (fs.existsSync('./config.json')) {
        const read_json = JSON.parse(fs.readFileSync('./config.json'))
        rocket_league_dir = read_json.rocket_league_directory
        loaded = read_json.loaded
    
        selected_mapfile = (custom_maps_folder_directory + "\\" + arg + ".udk")
        mods_folder_dir = rocket_league_dir + "\\TAGame\\CookedPCConsole\\mods"
    
        if (rocket_league_dir === null) {
            console.log('Setup not run');
        } else {
            if (rocket_league_dir === undefined) {
                console.log('Setup failed to run');
            } else {
                if (arg === 'undefined') {
                    console.log('No map selected');
                } else {
                    Overwrite.delete_overwrite_maps(mods_folder_dir)
                    Overwrite.overwrite_map(selected_mapfile, mods_folder_dir, arg2)
                    read_json.loaded = Boolean(true)
                    fs.writeFileSync('./config.json', JSON.stringify(read_json, null, 2));

                    let sendloaded = "Loaded"
                    let map = arg
                    win.webContents.send('Loaded_msg', sendloaded, map)
                }
            }
        }
    } else {
        console.log('no config.json');
    }
})

ipcMain.on("Add_btn_click", async function (event) {

    const read_json = JSON.parse(fs.readFileSync('./config.json'))
            rocket_league_dir = (read_json.rocket_league_directory)
            custom_maps_folder_directory = (read_json.custom_maps_folder_directory)

    if (rocket_league_dir === null) {
        console.log('Setup not run');
    } else {
        if (rocket_league_dir === undefined) {
            console.log('Setup not run');
        } else {
            let dir = await OpenDialog.OpenDialog3()
            const map_file = dir[0]
            const map_file_canceled = dir[1]
            var map_file_string = String(map_file)
            var map_file_canceled_string = String(map_file_canceled)
        }
    }

    if (map_file_canceled_string === 'true') {
        console.log("Canceled OpenDialog3");
    } else {
        if (map_file_canceled_string === undefined) {
            console.log("OpenDialog3 failed");
        } else {
            exec(`xcopy /y "${map_file_string}" "${custom_maps_folder_directory}"`,(err, stdo, stdr) => {
                if(err) {
                    console.log(err);
                    console.log("Error moving map file");
                } else {
                    console.log("Map file moved");
                }
                if(stdo) console.log(stdo);
                if(stdr) console.log(stdr);
                
                fs.readdir(custom_maps_folder_directory, function (err, files) {
                    if (err) {console.log(err)};
                    file_list = files.filter(el => path.extname(el) === '.udk')
                    let array_to_string = file_list.toString();
                    let edit_array = array_to_string.replace(/.udk/g, '');
                    let string_to_array = edit_array.split(',');
                    let sendclear = "clear_list"
                    event.sender.send('async-clear_reply', sendclear);
                    event.sender.send('async-reply', string_to_array);
                })
            })
        }
    }    
})

ipcMain.on("Sub_btn_click", function (event, arg) {
    selected_mapfile_dir = (custom_maps_folder_directory + "\\" + arg) + ".udk"
    console.log(selected_mapfile_dir)

    exec(`del "${selected_mapfile_dir}"`,(err, stdo, stdr) => {
        if(err) {
            console.log(err);
            console.log("Error removing map file");
        } else {
            console.log("Map file removed");
        }
        if(stdo) console.log(stdo);
        if(stdr) console.log(stdr);
        
        fs.readdir(custom_maps_folder_directory, function (err, files) {
            if (err) {console.log(err)};
            file_list = files.filter(el => path.extname(el) === '.udk')
            let array_to_string = file_list.toString();
            let edit_array = array_to_string.replace(/.udk/g, '');
            let string_to_array = edit_array.split(',');
            let sendclear = "clear_list"
            event.sender.send('async-clear_reply', sendclear);
            event.sender.send('async-reply', string_to_array);
        })
    })
})

ipcMain.on("Reset_btn_click", function () {
    if (fs.existsSync('./config.json')) {
        const read_json = JSON.parse(fs.readFileSync('./config.json'))
        rocket_league_dir = read_json.rocket_league_directory
        mods_folder_dir = rocket_league_dir + "\\TAGame\\CookedPCConsole\\mods"
        Overwrite.delete_mods_dir(mods_folder_dir)

        let sendclear = "clear_list"
        win.webContents.send('clear_list_msg', sendclear)

        read_json.setup_run = Boolean(false)
        read_json.rocket_league_directory = null
        read_json.custom_maps_folder_directory = null
        read_json.loaded = null
        fs.writeFileSync('./config.json', JSON.stringify(read_json, null, 2));

        let sendNull = null
        win.webContents.send('Loaded_msg', sendNull)

        console.log('Setup Reset: Done, Restarting Map Loader');
        app.relaunch()
        app.exit()
    } else {
        console.log('no config.json');
    }
})

ipcMain.on("Hamachi_btn_click", function () {
    if (fs.existsSync('./config.json')) {
        const read_json = JSON.parse(fs.readFileSync('./config.json'))
        let hamachi = read_json.hamachi

        if (hamachi === false) {
            exec(`cd setup && start hamachi_auto_install.exe`,(err, stdo, stdr) => {
                if (err) console.log(err);
                if(stdo) console.log(stdo);
                if(stdr) console.log(stdr);
            })
            read_json.hamachi = Boolean(true)
            fs.writeFileSync('./config.json', JSON.stringify(read_json, null, 2));
            console.log('hamachi installing automatiacally');
            console.log('hamachi should be installed');
        } else {
            console.log('hamachi already installed');
            exec(`cd C:/Program Files (x86)/LogMeIn Hamachi && start hamachi-2-ui.exe`,(err, stdo, stdr) => {
                if (err) console.log(err);
                if(stdo) console.log(stdo);
                if(stdr) console.log(stdr);
            })
        }
    } else {
        console.log('no config.json');
    }
})

ipcMain.on("Bakkes_btn_click", function () {
    if (fs.existsSync('./config.json')) {
        const read_json = JSON.parse(fs.readFileSync('./config.json'))
        let bakkesmod = read_json.bakkesmod

        if (bakkesmod === false) {
            exec(`cd setup && powershell -Command "Invoke-WebRequest -Uri 'https://github.com/bakkesmodorg/BakkesModInjectorCpp/releases/latest/download/BakkesModSetup.zip' -OutFile 'bakkes.zip'" && powershell -Command "expand-archive -path './bakkes.zip' -destinationpath 'bakkes'" && del bakkes.zip && cd bakkes && move "BakkesModSetup.exe" ".." && cd .. && rmdir bakkes && bakkes_auto_install.exe`,(err, stdo, stdr) => {
                if (err) console.log(err);
                if(stdo) console.log(stdo);
                if(stdr) console.log(stdr);
            })
            read_json.bakkesmod = Boolean(true)
            fs.writeFileSync('./config.json', JSON.stringify(read_json, null, 2));
            console.log('bakkesmod installing automatiacally');
            console.log('bakkesmod should be installed');
        } else {
            console.log('bakkesmod already installed');
            exec(`cd C:/Program Files/BakkesMod && start BakkesMod.exe`,(err, stdo, stdr) => {
                if (err) console.log(err);
                if(stdo) console.log(stdo);
                if(stdr) console.log(stdr);
            })
        }
    } else {
        console.log('no config.json');
    }
})

ipcMain.on("Unload_btn_click", function () {
    if (fs.existsSync('./config.json')) {
        const read_json = JSON.parse(fs.readFileSync('./config.json'))
        rocket_league_dir = read_json.rocket_league_directory
        mods_folder_dir = rocket_league_dir + "\\TAGame\\CookedPCConsole\\mods"
    
        if (rocket_league_dir === null) {
            console.log('Setup not run');
        } else {
            if (rocket_league_dir === undefined) {
                console.log('Setup failed to run');
            } else {
                Overwrite.delete_overwrite_maps(mods_folder_dir)
                read_json.loaded = Boolean(false)
                fs.writeFileSync('./config.json', JSON.stringify(read_json, null, 2));

                let sendUnloaded = "Unloaded"
                win.webContents.send('Loaded_msg', sendUnloaded)
            }
        }
    } else {
        console.log('no config.json');
    }

})

ipcMain.on("Settings_btn_click", function () {
    let windowstate = winstate();
    createWindow2(windowstate.x, windowstate.y);
    windowstate.manage(win2)
})

ipcMain.on("Online_btn_click", function () {
    let windowstate = winstate();
    createWindow3(windowstate.x, windowstate.y);
    windowstate.manage(win3)
})