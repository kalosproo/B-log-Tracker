// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCTAj_lXQrV6qvATrLnvg1o62Y4G5QeBmM",
  authDomain: "b-log-tracker-0101.firebaseapp.com",
  projectId: "b-log-tracker-0101",
  storageBucket: "b-log-tracker-0101.firebasestorage.app",
  messagingSenderId: "230746196644",
  appId: "1:230746196644:web:a76ade1f41bfc5b83bf431",
  measurementId: "G-2EYFQKE1DC"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Firestore database reference
const db = firebase.firestore();
