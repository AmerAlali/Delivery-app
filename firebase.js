import { initializeApp } from "firebase/app";
const firebaseConfig = {
  appId:
    "523640477261-cr4rn5q938fjh482sbv52fnqe440p47c.apps.googleusercontent.com",
  apiKey: "AIzaSyCshB8L8aSHBzTHMo_1b1XYsQ36qdYsGpM",
  projectId: "cravecorner-7456b",
  storageBucket: "gs://cravecorner-7456b.appspot.com",
  messagingSenderId: "523640477261",
  databaseURL: "https://cravecorner-7456b-default-rtdb.firebaseio.com/",
};

const firebase = initializeApp(firebaseConfig);

export default { firebase };
