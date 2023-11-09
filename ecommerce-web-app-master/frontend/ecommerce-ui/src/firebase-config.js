import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth"

const firebaseConfig = {
    apiKey: "AIzaSyB8X9BFuH59ez54Y2ZKhserOfa_AHElP7Y",
    authDomain: "comp5347-web-dev.firebaseapp.com",
    projectId: "comp5347-web-dev",
    storageBucket: "comp5347-web-dev.appspot.com",
    messagingSenderId: "876089709401",
    appId: "1:876089709401:web:f8ea69b3bb948299ac7248",
    measurementId: "G-YPK9JGV83V"
  };

  export const app = initializeApp(firebaseConfig);

  export const auth = getAuth(app)
