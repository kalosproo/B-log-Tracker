const firebaseConfig = {
  apiKey: "AIzaSyCTAj_lXQrV6qvATrLnvg1o62Y4G5QeBmM",
  authDomain: "b-log-tracker-0101.firebaseapp.com",
  projectId: "b-log-tracker-0101",
  storageBucket: "b-log-tracker-0101.appspot.com",
  messagingSenderId: "230746196644",
  appId: "1:230746196644:web:a76ade1f41bfc5b83bf431",
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const storage = firebase.storage();
