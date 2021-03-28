import Ably from 'ably/promises';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(_: NextApiRequest, res: NextApiResponse) {
  const client = new Ably.Realtime(process.env.ABLY_API_KEY);
  const tokenRequestData = await client.auth.createTokenRequest({ clientId: 'realtime-chat-client' });
  const currentChannel = process.env.NODE_ENV == 'development' ? 'chat-dev' : 'chat-main';
  Ably.Realtime.Crypto.generateRandomKey((err, key) => {
    client.channels.get(currentChannel, { cipher: { key: key, algorithm: 'AES', keyLength: 256, mode: 'CBC' } });
  });
  res.status(200).json(tokenRequestData);
}