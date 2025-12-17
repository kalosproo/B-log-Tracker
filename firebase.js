const firebaseConfig = {
  apiKey: "AIzaSyCTAj_lXQrV6qvATrLnvg1o62Y4G5QeBmM",
  authDomain: "b-log-tracker-0101.firebaseapp.com",
  projectId: "b-log-tracker-0101",
  messagingSenderId: "230746196644",
  appId: "1:230746196644:web:a76ade1f41bfc5b83bf431"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();
const provider = new firebase.auth.GoogleAuthProvider();
