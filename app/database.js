import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get, child } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDATIeq4Mj1wCqhbx3FsO01Xw946e1_SuU",
    authDomain: "gdsc-solutions-24.firebaseapp.com",
    projectId: "gdsc-solutions-24",
    storageBucket: "gdsc-solutions-24.appspot.com",
    messagingSenderId: "94466411968",
    appId: "1:94466411968:web:bb53c4176df5736e4e0c25",
    databaseURL: 'https://gdsc-solutions-24-default-rtdb.asia-southeast1.firebasedatabase.app'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getDatabase(app);


export default async function getAll() {
    const FinArr = []
    await get(child(ref(db), `HSPdata/`)).then((snapshot) => {
        const x = snapshot.val()
        // console.log(x)
        for (let key in x){
            // console.log(x[key]['data'])
            FinArr.push(x[key]['data'])
        }
        ;
    }).catch((error) => {
        console.error(error);
    });
    return FinArr
}



// export default function testwrite() {

set(ref(db, 'HSPdata/hsp_pax23x'), { 'data': ['Hospital 8', 'Sector 100', 28.683034, 77.212645, {'A+':22,'A-':12,'B+':62,'B-':233,'AB+':342,'AB-':52,'O+':22,'O-':52,}] });
// // }