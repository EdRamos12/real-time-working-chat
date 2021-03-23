import Head from 'next/head';
import dynamic from 'next/dynamic';

const AblyChatComponent = dynamic(() => import('../compontents/AblyChatComponent'), { ssr: false });

export default function Home() {
  return (
    <div>
      <Head>
        <title>chill chat</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>Edu's chat :D</h1>
        <h2>Still proof of concept, adding layout to this soon</h2>
        <AblyChatComponent />
      </main>
    </div>
  )
}
