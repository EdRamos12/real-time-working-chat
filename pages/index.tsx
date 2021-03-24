import Head from 'next/head';
import dynamic from 'next/dynamic';

const AblyChatComponent = dynamic(() => import('../components/AblyChatComponent'), { ssr: false });

export default function Home() {
  return (
    <div>
      <Head>
        <title>chill chat</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>Chill chat.</h1>
        <h2>Still proof of concept, adding layout to this soon</h2>
        <p>Limit of messages shown in screen are 50 now.</p>
        <AblyChatComponent />
      </main>
    </div>
  )
}
