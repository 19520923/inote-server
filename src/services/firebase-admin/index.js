import admin from "firebase-admin";
import serviceAccount from "./prefab-surfer-350006-firebase-adminsdk-zk1iu-4e6ca0c91a.json";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL:
    "https://prefab-surfer-350006-default-rtdb.asia-southeast1.firebasedatabase.app/",
});

export default admin;
