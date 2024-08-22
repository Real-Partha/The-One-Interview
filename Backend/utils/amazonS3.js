require('dotenv').config();
const { S3Client, GetObjectCommand, PutObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});

const getSignedUrlForObject = async (filename) => {
    const command = new GetObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: filename
    });
    const url = await getSignedUrl(s3, command, { expiresIn: 3600*24 });
    return url;
};

const uploadObject = async (filename, body) => {
    const command = new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: filename,
        Body: body
    });
    const response = await s3.send(command);
    return response;
};

module.exports = { getSignedUrlForObject, uploadObject };