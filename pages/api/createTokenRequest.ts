import Ably from 'ably/promises';

export default async function handler(_, res) {
  const client = new Ably.Realtime(process.env.ABLY_API_KEY);
  const tokenRequestData = await client.auth.createTokenRequest({ clientId: 'real-time-chat-test' });
  Ably.Realtime.Crypto.generateRandomKey((err, key) => {
    client.channels.get(process.env.NODE_ENV == 'development' ? 'chat-dev' : 'chat-main', { cipher: { key: key, algorithm: 'AES', keyLength: 256, mode: 'CBC' } });
  });
  res.status(200).json(tokenRequestData);
}