import Ably from 'ably/promises';
import { useEffect } from 'react';

const ably = new Ably.Realtime.Promise({ authUrl: 'api/createTokenRequest' });

export function useChannel(channelName: string, callbackOnMessage: any) {
  const channel = ably.channels.get(channelName);

  const onMount = () => {
    channel.subscribe(msg => {
      callbackOnMessage(msg);
    });
  }

  const onUnmount = () => {
    channel.unsubscribe();
  }

  useEffect(() => {
    onMount();
    return () => { onUnmount(); }
  });

  return [channel, ably];
}