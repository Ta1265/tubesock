import React, { useEffect, useRef } from 'react';
import VideoSearch from './VideoSearch';

export default function YouTubePlayer({ socket }) {
  const playerRef = useRef();

  function onPlayerReady() {
    console.log('ready to play?');
  }

  function loadVideoPlayer() {
    playerRef.current = new window.YT.Player('player', {
      playerVars: {
        autoplay: 0,
        rel: 0,
        showinfo: 0,
        egm: 0,
        showsearch: 0,
        controls: 0,
        modestbranding: 1,
      },
      height: '390',
      width: '640',
      events: {
        onReady: onPlayerReady,
      },
    });
  }

  socket.on('youtube-sync', (state) => { // remote video sent you its state change
    console.log('remote con changed video state to ->', state);
    if (state === 'play') playerRef.current.playVideo();
    if (state === 'pause') playerRef.current.pauseVideo();
  });

  socket.on('change-video', (videoId) => {
    console.log('remote con changed video to ->', videoId);
    playerRef.current.loadVideoById(videoId);
  });

  useEffect(() => {
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    window.onYouTubeIframeAPIReady = loadVideoPlayer;
  }, []);

  const style = {
    pointerEvents: 'none',
  };

  return (
    <div>
      <div ref={playerRef} id="player" style={style} />
      <button label="Play" type="button" onClick={() => socket.emit('youtube-sync', 'play')}>Play</button>
      <button label="Pause" type="button" onClick={() => socket.emit('youtube-sync', 'pause')}>Pause</button>
      <VideoSearch selectVideo={(videoId) => socket.emit('change-video', videoId)} />
    </div>
  );
}
