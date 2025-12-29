import { ERROR_CODES } from '@zylo/errors';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();
import fs from 'fs';
import type { Secret, GetPublicKeyOrSecret } from 'jsonwebtoken';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

export async function fetchMyChannelDetails(access_token: string) {
  if (!access_token || access_token === '') {
    console.error(ERROR_CODES.UNAUTHORIZED_ACCESS);
    return;
  }

  try {
    const response = await axios.get(process.env.YOUTUBE_API_URL!, {
      params: {
        part: 'snippet,contentDetails,statistics',
        mine: true,
      },
      headers: {
        Authorization: `Bearer ${access_token}`,
        Accept: 'application/json',
      },
    });

    const channelData = response.data.items[0];

    if (channelData) {
      return channelData;
    } else {
      console.log(ERROR_CODES.INTERNAL_SERVER_ERROR);
    }
  } catch (error: any) {
    console.error(ERROR_CODES.ERROR_FETCHING_YT_DETAILS, error.response?.data || error.message);
  }
}

const ACCESS_TOKEN = '';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const VIDEO_FILE_PATH = 'src/videos/Screen Recording 2025-11-27 at 6.42.47 PM.mp4';

const VIDEO_METADATA = {
  snippet: {
    title: 'My First YouTube API Upload',
    description: 'This video was uploaded programmatically using the YouTube Data API and Node.js.',
    tags: ['api upload', 'nodejs', 'youtube'],
    categoryId: '22',
  },
  status: {
    privacyStatus: 'public',
  },
};
export async function uploadVideo() {
  if (!fs.existsSync(VIDEO_FILE_PATH)) {
    console.error(`❌ Error: Video file not found at path: ${VIDEO_FILE_PATH}`);
    console.error("Please ensure 'test.mp4' exists or the path is correct.");
    return;
  }

  const fileSize = fs.statSync(VIDEO_FILE_PATH).size;
  const videoStream = fs.createReadStream(VIDEO_FILE_PATH);

  try {
    console.log('1️⃣ Initiating resumable upload and sending metadata...');

    const initiationResponse = await axios.post(
      'https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status',
      VIDEO_METADATA,
      {
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          'Content-Type': 'application/json; charset=UTF-8',

          'X-Upload-Content-Length': fileSize,
          'X-Upload-Content-Type': 'video/mp4',
        },
      },
    );

    const uploadUrl = initiationResponse.headers.location;
    console.log(`✅ Upload initiated. Resumable URL received: ${uploadUrl}`);
    console.log(`Payload size: ${fileSize} bytes`);

    console.log('2️⃣ Uploading video data...');

    const uploadResponse = await axios.put(uploadUrl, videoStream, {
      headers: {
        'Content-Type': 'video/mp4',
      },

      onUploadProgress: (progressEvent: any) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        process.stdout.write(`\rUpload progress: ${percentCompleted}%`);
      },
    });

    console.log('\n✅ Video Upload Complete!');
    console.log('------------------------------------------');
    console.log(`Video Title: ${uploadResponse.data.snippet.title}`);
    console.log(`Video ID: ${uploadResponse.data.id}`);
    console.log(`Status: ${uploadResponse.data.status.uploadStatus}`);
    console.log(`Video URL: https://youtu.be/${uploadResponse.data.id}`);
  } catch (error: any) {
    console.error('\n❌ An error occurred during the video upload process.');

    console.error('Error Status:', error.response?.status);
    console.error('Error Data:', error.response?.data);
  }
}

export const getGooglePublicKeySomehow = (): GetPublicKeyOrSecret => {

  return (header: any, callback: any) => {
    axios
      .get('https://www.googleapis.com/oauth2/v3/certs')
      .then((response) => {
        const keys = response.data.keys;
        const kid = header.kid;
        const key = keys.find((k: any) => k.kid === kid);

        if (!key) {
          return callback(new Error('Unable to find key with matching kid'));
        }
        const publicKey = crypto.createPublicKey({
          key: {
            kty: key.kty,
            n: key.n,
            e: key.e,
          },
          format: 'jwk',
        });

        const pem = publicKey.export({ format: 'pem', type: 'spki' });
        callback(null, pem);
      })
      .catch((err) => callback(err));
  };
};
