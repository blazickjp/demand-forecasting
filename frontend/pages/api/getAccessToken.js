// pages/api/getAccessToken.js

import { GoogleAuth } from 'google-auth-library';

export default async function handler(req, res) {
    try {
        const auth = new GoogleAuth({
            scopes: 'https://www.googleapis.com/auth/cloud-platform',
            keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS, // Add this line
        });
        const client = await auth.getClient();
        const token = await client.getAccessToken();

        res.status(200).json({ accessToken: token });
    } catch (error) {
        console.error('Error retrieving access token:', error);
        res.status(500).json({ error: 'Failed to retrieve access token' });
    }
}
