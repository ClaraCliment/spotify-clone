import { useSession } from "next-auth/react";
import { ChevronDownIcon } from '@heroicons/react/outline';
import { useState, useEffect} from "react"
import Songs from './Songs';
import  { signOut } from 'next-auth/react';

// it's quite a heavy library so don't import the whole library, just shuffle
import { shuffle } from "lodash"

const colors = [
    "from-indigo-500",
    "from-blue-500",
    "from-green-500",
    "from-red-500",
    "from-yellow-500",
    "from-pink-500",
    "from-purple-500",
];
import { useRecoilState, useRecoilValue } from 'recoil';
import { playlistIdState, playlistState } from '../atoms/playlistAtom';
import useSpotify from "../hooks/useSpotify";

function Center() {

    const spotifyApi = useSpotify();
    const { data: session} = useSession();
    const [color, setColor] = useState(null);
    const playlistId  = useRecoilValue(playlistIdState);
    const [playlist, setPlaylist] = useRecoilState(playlistState);

    useEffect(() => {
        setColor(shuffle(colors).pop())
    }, [playlistId]);

    useEffect(() => {
        spotifyApi
            .getPlaylist(playlistId)
            .then((data) => {setPlaylist(data.body)})
            .catch((err) => console.log("Something went wrong: " + err))
    }, [spotifyApi, playlistId]);

    console.log(playlist);

  return (
    <div className="flex-grow overflow-y-scroll scrollbar-hide h-screen">
        <header className="absolute top-5 right-8">
            <div onClick={() => signOut()} className="flex items-center bg-black space-x-3 text-white opacity-90 hover:opacity-80 cursor-pointer rounded-full p-1 pr-2 ">
                <img className="rounded-full w-10 h-10"
                src={session?.user.image}
                alt={session?.user.name}
                />
                <h2>{session?.user.name}</h2>
                <ChevronDownIcon className="h-5 w-5"/>
                    
            </div>
        </header>
        <section className={`flex items-end space-x-7 bg-gradient-to-b to-black ${color} h-80 text-white p-8`}>
            <img className="h-44 w-44 shadow-2xl" src={playlist?.images?.[0].url} alt="" />
            <div>
                <p>PLAYLIST</p>
                <h2 className="text-2xl md:text-3xl xl:text-5xl">{playlist?.name}</h2>
            </div>
        </section>

        <div>
            <Songs />
        </div>
    </div>
  )
}

export default Center