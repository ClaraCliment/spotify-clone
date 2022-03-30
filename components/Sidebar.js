import { 
    HomeIcon,
    SearchIcon,
    LibraryIcon,
    PlusCircleIcon,
    HeartIcon,
    RssIcon,
} from '@heroicons/react/outline';
import  { useSession } from 'next-auth/react';
import { useEffect, useState} from 'react';
import { useRecoilState } from 'recoil';
import useSpotify from '../hooks/useSpotify';
import { playlistIdState } from '../atoms/playlistAtom';

function Sidebar() {
    const spotifyApi = useSpotify();
    const { data: session, status} = useSession();
    const [playlists, setPlaylists] = useState([]);
    const [playlistId, setPlaylistId] = useRecoilState(playlistIdState);

    console.log("you picked: " + playlistId)

    useEffect(() => {
        if(spotifyApi.getAccessToken()) {
            spotifyApi.getUserPlaylists().then((data) => {
                setPlaylists(data.body.items)
            })
        }
    }, [session, spotifyApi]);

  return (
    <div className='text-gray-500 p-5 pb-36 text-xs sm:max-w-[12rem] lg:max-w-[15rem] lg:text-sm  border-r border-gray-900 overflow-y-scroll h-screen scrollbar-hide hidden md:inline-flex'>
        <div className='space-y-4'>
            <button className='flex items-center space-x-2 hover:text-white'>
                <HomeIcon className='w-5 h-5'/>
                <p>Home</p>
            </button>
            <button className='flex items-center space-x-2 hover:text-white'>
                <SearchIcon className='w-5 h-5'/>
                <p>Search</p>
            </button>
            <button className='flex items-center space-x-2 hover:text-white'>
                <LibraryIcon className='w-5 h-5'/>
                <p>Your Library</p>
            </button>
            <hr className='border-t-[0.1px] border-gray-900' />  

            <button className='flex items-center space-x-2 hover:text-white'>
                <PlusCircleIcon className='w-5 h-5'/>
                <p>Create Playlist</p>
            </button>
            <button className='flex items-center space-x-2 hover:text-white'>
                <HeartIcon className='w-5 h-5'/>
                <p>Linked Songs</p>
            </button>
            <button className='flex items-center space-x-2 hover:text-white'>
                <RssIcon className='w-5 h-5'/>
                <p>Your episodes</p>
            </button>
            <hr className='border-t-[0.1px] border-gray-900' /> 

            { /** Here will be the playlist when we connect with Spotify API */}
            {playlists.map((playlist)=> (
                <p onClick={() => setPlaylistId(playlist.id)} key={playlist.id} className='cursor-pointer hover:text-white'>{playlist.name}</p>
            ))}
            
        </div>
    </div>
  )
}

export default Sidebar