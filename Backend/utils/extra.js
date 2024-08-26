require('dotenv').config();
const {deleteObject}=require('./amazonS3');

deleteObject('aryanroy1_1724520815462.jpg').then((data)=>{
    console.log(data);
    
}
).catch((error)=>{
    console.log(error);
}
);