import { useSession } from 'next-auth/react';
import useSpotify from '../hooks/useSpotify';
import { currentTranckIdState, isPlayingState } from '../atoms/songAtom';
import { useRecoilState } from 'recoil';
import { useEffect, useState, useCallback } from 'react';
import useSongInfo from '../hooks/useSongInfo';
import { 
    HeartIcon,
    VolumeUpIcon as VolumeDownIcon

} from '@heroicons/react/outline';
import { 
    RewindIcon,
    FastForwardIcon,
    PauseIcon,
    PlayIcon,
    ReplyIcon,
    VolumeUpIcon,
    SwitchHorizontalIcon,
} from '@heroicons/react/solid';
import {debounce} from 'lodash';

function Player() {

    const spotifyApi = useSpotify();
    const { data: session, status} = useSession();
    const [currentTrackId, setCurrentTrackId] = useRecoilState(currentTranckIdState);
    const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
    const [volume, setVolume] = useState(50);
    const songInfo = useSongInfo();

    const fetchCurrentSong = () => {
        if(!songInfo) {
            spotifyApi.getMyCurrentPlayingTrack().then((data) => 
            {console.log("Now playing: " + data.body?.item);
            setCurrentTrackId(data.body?.item?.id);
        
            spotifyApi.getMyCurrentPlaybackState().then((data) => {
                setIsPlaying(data.body?.is_playing)
            })})
        }
    }

    useEffect(() => {
       if(spotifyApi.getAccessToken() && !currentTrackId) {
           // I wanna fetch the song info 
           fetchCurrentSong();
           setVolume(50);
       }
    }, [currentTranckIdState, spotifyApi, session]);

    const handlePlayPause = () => {
        spotifyApi.getMyCurrentPlaybackState().then((data) => {
            if(data.body.is_playing) {
                spotifyApi.pause();
                setIsPlaying(false);
            } else {
                spotifyApi.play();
                setIsPlaying(true);
            }

        })
    }

    useEffect(() => {
       if(volume > 0 && volume < 100) {
           debounceAdjustVolume(volume);
       }
    }, [volume]);

    const debounceAdjustVolume = useCallback(
        debounce((volume) => {
            spotifyApi.setVolume(volume).catch((err) => {
                
            })
        }, 500, [])
    )

  return (
    <div className='text-white h-24 bg-gradient-to-b from-black to-gray-900 grid grid-cols-3 text-xs md:text-base px-2 md:px-8'>
        {/** Left part */}
      <div className='flex items-center space-x-4'>
          <img className='hidden md:inline h-10 w-10' src={songInfo?.album.images?.[0]?.url} alt={songInfo?.album.name} />
          <div>
              <h3>{songInfo?.name}</h3>
              <p>{songInfo?.artists?.[0]?.name}</p>
          </div>
      </div>
      {/** Center */}
      <div className='flex items-center justify-evenly'>
      <SwitchHorizontalIcon className='button' />
      <RewindIcon className='button' 
    //   onClick={() => spotifyApi.skipToPrevious()} -----> API is not working properly
      />
      {isPlaying ? 
      (<PauseIcon onClick={handlePlayPause} className='button w-10 h-10'/>) : (<PlayIcon onClick={handlePlayPause} className='button  w-10 h-10' />)}

      <FastForwardIcon 
        //   onClick={() => spotifyApi.skipToNext()} -----> API is not working properly
        className='button' />
      <ReplyIcon className='button'/>
      </div>

      { /** Right side */}
      <div className='flex items-center space-x-3 md:space-x-4 justify-end pr-5'>
          <VolumeDownIcon className='button' onClick={() => volume > 0 && setVolume(volume - 10)}/>
          <input type="range" min={0} max={100} value={volume} className="w-14 md:w-28" onChange={(e) => {setVolume(Number(e.target.value))}}/>
          <VolumeUpIcon className='button' onClick={() => volume < 100 && setVolume(volume + 10)}/>
      </div>
    </div>
  )
}

export default Player
