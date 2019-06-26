const {app, Menu} = require('electron')
const {viewProfile} = require('../js/viewProfile')
const template = [
    {
      label:'Tms',
      submenu:[
        {
          label:'Check For Updates'
        },
        {
          type:'separator'
        },
        {role:'hide'},
        {role:'hideOthers'},
        {
          type:'separator'
        },
        {role:'quit'},
      ]
    },
    {
      label:'File',
      submenu:[
        {
          label:'View Profile',
          click:function(){
            
          }
        },
        {
          type:'separator'
        },
        {
          label:'Sign Out'
        }
      ]
    },
    {
      label:'Edit',
      submenu:[
        {role: 'undo'},
        {role: 'redo'},
        {
          type:'separator'
        },
        {role: 'cut'},
        {role: 'copy'},
        {role: 'paste'},
        {role: 'selectAll'}
      ]
    },
    {
      label:'View',
      submenu:[
        {role :'toggleFullScreen'},
        {
          type:'separator'
        },
        {role:'resetZoom'},
        {role:'zoomIn'},
        {role:'zoomOut'},
        {
          type:'separator'
        },
        {role:'reload'},
        {role:'toggleDevTools'}
      ]
    },
    {
      label:'Window',
      submenu:[
        {role:'minimize'},
        {role:'close'},
        {
          type:'separator'
        },
        {role:'front'},
        {
          type:'separator'
        },
        {role:'selectNextTab'},
        {role:'selectPreviousTab'}
      ]
    }
  ]
  

  installApplicationMenu = function (){
    const menu = Menu.buildFromTemplate(template)
     Menu.setApplicationMenu(menu)
}

module.exports = {
    installApplicationMenu
}