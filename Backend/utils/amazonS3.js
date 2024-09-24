require('dotenv').config();
const { S3Client, GetObjectCommand, PutObjectCommand,DeleteObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_BUCKET_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});

const getSignedUrlForObject = async (filename) => {
    const command = new GetObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: filename
    });
    const url = await getSignedUrl(s3, command, { expiresIn: 60 * 5 });
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

//Remove object from S3
const deleteObject = async (filename) => {
    const command = new DeleteObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: filename
    });
    const response = await s3.send(command);
    return response;
};

module.exports = { getSignedUrlForObject, uploadObject, deleteObject };