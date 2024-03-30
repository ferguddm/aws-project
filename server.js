require('dotenv').config();
const express = require('express');
const multer = require('multer');
const AWS = require('aws-sdk');

const app = express();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});

app.use(express.static('public'));

app.post('/upload', upload.single('file'), async (req, res) => {
    const file = req.file;
    const params = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: file.originalname,
        Body: file.buffer,
        ContentType: file.mimetype
    };

    try {
        await s3.upload(params).promise();
        res.send('Dosya başarıyla S3\'e yüklendi!');
    } catch (err) {
        console.error(err);
        res.status(500).send('Dosya yüklenirken bir hata oluştu.');
    }
});

app.listen(3001, () => {
    console.log(`Sunucu http://localhost:3001 adresinde çalışıyor.`);
});
