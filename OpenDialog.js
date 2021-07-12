const {dialog,BrowserWindow} = require('electron');

async function OpenDialog1(){
    let promise=new Promise((resolve, reject)=>{
      window = new BrowserWindow({
          show: false,
          width: 800, 
          height: 600,
          icon: "Assets/icon.png"
      })

      
      dialog.showOpenDialog(window, {
          properties: ['openDirectory'],
          title: "Choose a new custom maps folder",
          buttonLabel : "Load Folder",
        }).then(result => {
          custom_maps_folder = [result.filePaths, result.canceled];        
          resolve(custom_maps_folder)
        }).catch(err => {
          console.log(err)
          reject(err)
        })
    })
    return await promise
}

async function OpenDialog2(){
  let promise=new Promise((resolve, reject)=>{
    window = new BrowserWindow({
        show: false,
        width: 800, 
        height: 600,
        //icon: "Assets/icon.png"
    })
    
    dialog.showOpenDialog(window, {
        properties: ['openDirectory'],
        title: "Where is Rocket league installed?",
        defaultPath: "C:\\Program Files"
      }).then(result => {
        custom_maps_folder = [result.filePaths, result.canceled];        
        resolve(custom_maps_folder)
      }).catch(err => {
        console.log(err)
        reject(err)
      })
  })
  return await promise
}

async function OpenDialog3(){
  let promise=new Promise((resolve, reject)=>{
    window = new BrowserWindow({
        show: false,
        width: 800, 
        height: 600,
        //icon: "Assets/icon.png"
    })

    options = {
      title: "Pick the map you want to add",
      buttonlabel: "Add map",

      filters :[
        {name: 'UDK file', extensions: ['udk']},
        {name: 'All Files', extensions: ['*']}
       ],
    }
    
    dialog.showOpenDialog(window, options, {
      properties: ['openFile','multiSelections']
      }).then(result => {
        custom_maps_folder = [result.filePaths, result.canceled];        
        resolve(custom_maps_folder)
      }).catch(err => {
        console.log(err)
        reject(err)
      })
  })
  return await promise
}

exports.OpenDialog1 = OpenDialog1
exports.OpenDialog2 = OpenDialog2
exports.OpenDialog3 = OpenDialog3