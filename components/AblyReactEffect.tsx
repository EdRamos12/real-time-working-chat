import Ably from 'ably/promises';
import { useEffect, useState } from 'react';

const ably = new Ably.Realtime.Promise({ authUrl: 'api/createTokenRequest' });

export function useChannel(channelName: string, callbackOnMessage: any) {
  const channel = ably.channels.get(channelName);

  const onMount = () => {
    channel.presence.subscribe(member => {});
    channel.subscribe(msg => {
      callbackOnMessage(msg);
    });
    channel.presence.enter(null);
  }

  const onUnmount = () => {
    channel.unsubscribe();
  }

  const useEffectHood = () => {
    onMount();
    return () => { onUnmount(); }
  }

  useEffect(useEffectHood);

  return [channel, ably];
}