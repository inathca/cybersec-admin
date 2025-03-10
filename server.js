const express = require('express');
const {PrismaClient} = require("@prisma/client");
const bodyParser = require("body-parser")
const crypto = require("crypto-js");
const env = require("dotenv");

env.config();
/*function encodeData(data){
    const password = crypto.AES.encrypt(data, process.env.SECRET_KEY);
    return password.toString();
} */

    function encodeData(data) {
        return crypto.AES.encrypt(data, process.env.SECRET_KEY, { format: CryptoJS.format.OpenSSL }).toString();
    }

    
/*function decodeData(data){
    const password = crypto.AES.decrypt(data, process.env.SECRET_KEY);
    return password.toString(crypto.enc.Utf8);
}
*/

function decodeData(data) {
    console.log("🔍 Data before decryption:", data);
    if (!data) return ""; // ป้องกันค่าที่ไม่มี
    try {
        const bytes = crypto.AES.decrypt(data, process.env.SECRET_KEY);
        return bytes.toString(crypto.enc.Utf8);
    } catch (error) {
        console.error("Error decrypting data:", error);
        return "";
    }
}

const app = express()
app.use(bodyParser.json())
const prisma =  new PrismaClient();
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/user', async (req,res) =>{
    const data = await prisma.$queryRaw `select id, username, cardid from user`;
    const finalData = data.map(record => ({
        ...record,
        //cardId: decodeData(record.cardId)
        cardId: record.cardId ? decodeData(record.cardId) : null
    }));
    console.log(finalData);
    res.json({
        message: 'okay',
        data: finalData
    })
    // const data = await prisma.user.findMany();
    //const data = await prisma.$queryRaw `select id, username, cardid from user`;
    //const finalDAta = await data.map(record =>{
        //console.log('record', record)
        //dalete record.password;
        //return record;
    //});
    //res.json({
        //message: 'okay',
        //data: finalDAta
        //data
    //})
});

app.post('/user', async (req, res) =>{
    console.log(req.body)
    const response = await prisma.user.create({
        data: {
            username: req.body.username,
            password: encodeData(req.body.password),
            cardId: encodeData(req.body.cardId)
        }
    });
    if(response){
        res.json({
            message: "add successfully"
        })
    }else{
        res.json({
            message: "failed"
        })
    }
});
app.put('/user', async (req, res) => {
    const response = await prisma.user.update({
        select: {
            password: true,
            id: true
        },
        where: {
            id: req.body.id
        },
        data: {
            password: encodeData(req.body.password)
        }
    });
    if (response) { 
        res.json({
            message: "update sucessfully"
        })
    } else { 
        res.json({
            message: "update fail"
    })}
});

app.delete('/user', async (req, res) => {
    const response = await prisma.user.delete({
        where: {
            id: req.body.id
        },
        select:{
            username: true
        }
       });
       if (response) { 
        res.json({
            message: "delete sucessfully"
             })
        } else { 
            res.json({
                message: "delete fail"
    })}
});

app.listen(port, () => {
  console.log(`server is running on port ${port}`)
})