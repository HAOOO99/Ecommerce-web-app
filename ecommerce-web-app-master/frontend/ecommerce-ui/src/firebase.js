// import firebase from  'firebase/compat/app'
// import 'firebase/compat/auth' 

import firebase from  'firebase/app'
import 'firebase/auth' 

const app = firebase.initializeApp({
    apiKey: "AIzaSyB8X9BFuH59ez54Y2ZKhserOfa_AHElP7Y",
    authDomain: "comp5347-web-dev.firebaseapp.com",
    projectId: "comp5347-web-dev",
    storageBucket: "comp5347-web-dev.appspot.com",
    messagingSenderId: "876089709401",
    appId: "1:876089709401:web:f8ea69b3bb948299ac7248",
    measurementId: "G-YPK9JGV83V"
})

export const auth = app.auth()
export default app