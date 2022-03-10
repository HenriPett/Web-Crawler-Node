import { parentPort } from 'worker_threads'
import admin from 'firebase-admin'

const firebaseConfig = {
  apiKey: 'XXXXXXXXXXXX-XXX-XXX',
  authDomain: 'XXXXXXXXXXXX-XXX-XXX',
  databaseURL: 'XXXXXXXXXXXX-XXX-XXX',
  projectId: 'XXXXXXXXXXXX-XXX-XXX',
  storageBucket: 'XXXXXXXXXXXX-XXX-XXX',
  messagingSenderId: 'XXXXXXXXXXXX-XXX-XXX',
  appId: 'XXXXXXXXXXXX-XXX-XXX',
}

admin.initializeApp(firebaseConfig)
const db = admin.firestore()
// get current data in DD-MM-YYYY format
const date = new Date()
const currDate = `${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`
// recieve crawled data from main thread
parentPort.once('message', (message) => {
  console.log('Recieved data from mainWorker...')
  // store data gotten from main thread in database
  db.collection('Rates')
    .doc(currDate)
    .set({
      rates: JSON.stringify(message),
    })
    .then(() => {
      // send data back to main thread if operation was successful
      parentPort.postMessage('Data saved successfully')
    })
    .catch((err) => console.log(err))
})
