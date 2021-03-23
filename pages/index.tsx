import Head from 'next/head';
import dynamic from 'next/dynamic';

const AblyChatComponent = dynamic(() => import('../compontents/AblyChatComponent'), { ssr: false });

export default function Home() {
  return (
    <div>
      <Head>
        <title>teste de chat do duduzinho eeee</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>edu's advanced chat :D</h1>
        <AblyChatComponent />
      </main>
    </div>
  )
}
