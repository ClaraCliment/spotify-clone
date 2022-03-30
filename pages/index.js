import { NextPage } from 'next'
import Head from 'next/head'
import Sidebar from "../components/Sidebar";
import Center from '../components/Center'
import { getSession } from 'next-auth/react';
import Player from "../components/Player";

const Home = () => {
  return (
    <div className="bg-black h-screen overflow-hidden">
      <Head>
        <title>Spotify clone</title>
        <meta name="description" content="This is a Spotify clone for educational purposes." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className='flex'>
        <Sidebar />
        <Center />
      </main>

      { /** Here goes the player */}
      <div className='sticky bottom-0'>
        <Player />
      </div>
    </div>
  )
}

export default Home

export async function getServerSideProps(context) {
  const session = await getSession(context);

  return {
    props: {
      session
    }
  }
}
