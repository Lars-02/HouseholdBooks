import { Injectable } from "@angular/core";
import { getDatabase } from "firebase/database";
import { initializeApp } from "firebase/app";

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  private firebaseConfig = {
    apiKey: "AIzaSyC5jD8ptDugm23aR4UkdOAC3prU9aKT1e8",
    authDomain: "householdbooks-6a05f.firebaseapp.com",
    // The value of `databaseURL` depends on the location of the database
    databaseURL: "https://householdbooks-6a05f-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "householdbooks-6a05f",
    storageBucket: "householdbooks-6a05f.appspot.com",
    messagingSenderId: "SENDER_ID",
    appId: "APP_ID",
    // For Firebase JavaScript SDK v7.20.0 and later, `measurementId` is an optional field
    measurementId: "G-MEASUREMENT_ID",
  };

  db = getDatabase(initializeApp(this.firebaseConfig));
}
