import React, { useEffect, useRef } from 'react';
import './YouTubePlayer.css';

export default function YouTubePlayer({ socket }) {
  const playerRef = useRef();

  function onPlayerReady() {
    console.log('ready to play?');
    socket.emit('youtube-player-ready', 'ready');
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
      events: {
        onReady: onPlayerReady,
      },
    });
  }
  socket.on('youtube-sync', (state) => { // remote video sent you its state change
    console.log('remote con changed video state to ->', state);
    if (state === 'play') playerRef.current.playVideo();
    if (state === 'pause') playerRef.current.pauseVideo();
    if (state === 'reset') playerRef.current.seekTo(1, false);
  });

  socket.on('change-video', (videoId) => {
    console.log('remote con changed video to ->', videoId);
    playerRef.current.cueVideoById(videoId, 0);
  });

  useEffect(() => {
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    window.onYouTubeIframeAPIReady = loadVideoPlayer;
  }, []);

  return (
    <div className="youtubePlayerContainer">
      <div className="videoWrapper">
        <div ref={playerRef} id="player" className="player" />
      </div>
      <div className="controlsWrapper">
        <div className="svgWrapper" onClick={() => socket.emit('youtube-sync', 'play')} role="button" tabIndex="0" onKeyPress={() => socket.emit('youtube-sync', 'play')}>
          <svg className="playIcon" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
            <path fill="green" d="M424.4 214.7L72.4 6.6C43.8-10.3 0 6.1 0 47.9V464c0 37.5 40.7 60.1 72.4 41.3l352-208c31.4-18.5 31.5-64.1 0-82.6z" />
          </svg>
        </div>
        <div className="svgWrapper" onClick={() => socket.emit('youtube-sync', 'pause')} role="button" tabIndex="0" onKeyPress={() => socket.emit('youtube-sync', 'pause')}>
          <svg className="pauseIcon" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
            <path fill="red" d="M144 479H48c-26.5 0-48-21.5-48-48V79c0-26.5 21.5-48 48-48h96c26.5 0 48 21.5 48 48v352c0 26.5-21.5 48-48 48zm304-48V79c0-26.5-21.5-48-48-48h-96c-26.5 0-48 21.5-48 48v352c0 26.5 21.5 48 48 48h96c26.5 0 48-21.5 48-48z" />
          </svg>
        </div>
      </div>
    </div>
  );
}
