//Node native stuff
const path = require('path')
const url = require('url')
const fs = require('fs');

//3rd party node modules
const electron = require('electron')
const moment = require('moment');

//Custom modules
const isit = require('./modules/isit');
const daysUntilStirsdag = require('./modules/daysUntilStirsdag');
const dayBender = require('./modules/dayBender');
const stirsHtml = require('./modules/stirsHtml');

//Electron modules
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const Notification = electron.Notification
const ipcMain = electron.ipcMain
const Menu = electron.Menu

const date = new Date(),
      today = date.getDay();

const weekday = moment().locale('nb').format('dddd');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
let stirsdagsNoty, 
  allOtherDaysNoty,
  autoLauncher;

const nextStirsdagDate = moment(date).locale('nb').add(daysUntilStirsdag(today), 'days');

const nextStirsdagDatePretty = moment(nextStirsdagDate).calendar(null ,{
  lastDay : '[i går]',
  sameDay : '[i dag]',
  nextDay : '[i morgen]',
  lastWeek : '[forrige] dddd',
  nextWeek : 'dddd',
  sameElse : 'L'
})

const isStirsdag = isit(today);

function createWindow () {

  mainWindow = new BrowserWindow({
    width: 700, 
    height: 500
  })

  // Lload the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))
  
  stirsdagsNoty = new Notification({
    title: "I dag er det Blazing Stirsdag!",
    subtitle: "Disen trikkestopp kl 18:00. Fordi du fortjener det.",
    closeButtonText: "Notert!"
  })

  allOtherDaysNoty = new Notification({
    title: "Hold ut!",
    subtitle: `I dag er det bare ${daysUntilStirsdag(today)} ${dayBender(daysUntilStirsdag(today))} igjen til Stirsdag!`,
    closeButtonText: "Fett!"
  })


  if(isStirsdag){
    stirsdagsNoty.show()
  }else{
    allOtherDaysNoty.show()
  }

  ipcMain.on('isStirsdag', (event, arg) => {
    event.returnValue = isStirsdag;
  });

  ipcMain.on('htmlFromBackend', (event, arg) => {
    event.returnValue = stirsHtml(isStirsdag, weekday, nextStirsdagDatePretty);
  })


  

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    mainWindow = null
  })


}

app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow()
  }
})
