import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import crypto from 'crypto';

const bucket = process.env.S3_BUCKET_NAME || process.env.AWS_S3_BUCKET;
const region = process.env.AWS_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

if (bucket && (!region || !accessKeyId || !secretAccessKey)){
  console.warn('S3 credentials are incomplete. Uploads will fail until AWS_REGION, AWS_ACCESS_KEY_ID, and AWS_SECRET_ACCESS_KEY are set.');
}

const s3Client = bucket && region && accessKeyId && secretAccessKey
  ? new S3Client({
      region,
      credentials: { accessKeyId, secretAccessKey },
    })
  : null;

function sanitizeFileName(name: string){
  return name
    .toLowerCase()
    .replace(/[^a-z0-9.-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export async function uploadFileToS3(file: File, prefix: string){
  if (!s3Client || !bucket){
    throw new Error('S3 client is not configured. Set AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, and S3_BUCKET_NAME (or AWS_S3_BUCKET).');
  }

  const originalName = file.name || 'upload';
  let safeName = sanitizeFileName(originalName);
  if (!safeName) safeName = 'upload';
  const key = `${prefix}/${Date.now()}-${crypto.randomUUID()}-${safeName}`;
  const arrayBuffer = await file.arrayBuffer();

  await s3Client.send(new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: Buffer.from(arrayBuffer),
    ContentType: file.type || 'application/octet-stream'
  }));

  return {
    url: `https://${bucket}.s3.${region}.amazonaws.com/${key}`,
    key,
  };
}

export async function deleteFileFromS3(key: string){
  if (!s3Client || !bucket){
    throw new Error('S3 client is not configured.');
  }

  await s3Client.send(new DeleteObjectCommand({
    Bucket: bucket,
    Key: key,
  }));
}
