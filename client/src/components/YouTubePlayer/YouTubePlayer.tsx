import React, { useRef, useEffect } from 'react';
import styles from './YouTubePlayer.module.css';

interface Props {
  socket: SocketIOClient.Socket;
}

export default function myYouTubePlayer({ socket }: Props): JSX.Element {
  const playerRef = useRef<any>();
  let player;

  function onPlayerReady(event: any) {
    socket.emit('youtube-player-ready', 'ready');
    playerRef.current = event.target;
  }

  function loadVideoPlayer() {
    player = new YT.Player('player', {
      playerVars: {
        autoplay: 0,
        rel: 0,
        showinfo: 0,
        // egm: 0,
        // showsearch: 0,
        controls: 0,
        modestbranding: 1,
      },
      events: {
        onReady: onPlayerReady,
      },
    });
  }
  socket.on('youtube-sync', (state: string) => {
    // remote video sent you its state change
    if (state === 'play') playerRef.current?.playVideo();
    if (state === 'pause') playerRef.current?.pauseVideo();
    if (state === 'reset') playerRef.current?.seekTo(0, true);
  });

  socket.on('change-video-id', (videoId: string) => playerRef.current?.cueVideoById(videoId, 0));

  useEffect(() => {
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    (window as any).onYouTubeIframeAPIReady = loadVideoPlayer;
  }, []);

  return (
    <div className={styles.youtubePlayerContainer}>
      <div className={styles.videoWrapper}>
        <div ref={playerRef} id="player" className={styles.player} />
      </div>
      <div className={styles.controlsWrapper}>
        <div
          role="button"
          tabIndex={0}
          className={styles.svgWrapper}
          onClick={() => socket.emit('youtube-sync', 'reset')}
          onKeyPress={() => socket.emit('youtube-sync', 'reset')}
        >
          <svg
            className={styles.rewindIcon}
            aria-hidden="true"
            focusable="false"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
          >
            <path
              fill="black"
              d="M11.5 280.6l192 160c20.6 17.2 52.5 2.8 52.5-24.6V96c0-27.4-31.9-41.8-52.5-24.6l-192 160c-15.3 12.8-15.3 36.4 0 49.2zm256 0l192 160c20.6 17.2 52.5 2.8 52.5-24.6V96c0-27.4-31.9-41.8-52.5-24.6l-192 160c-15.3 12.8-15.3 36.4 0 49.2z"
            />
          </svg>
        </div>
        <div
          className={styles.svgWrapper}
          onClick={() => socket.emit('youtube-sync', 'play')}
          role="button"
          tabIndex={0}
          onKeyPress={() => socket.emit('youtube-sync', 'play')}
        >
          <svg
            className={styles.playIcon}
            aria-hidden="true"
            focusable="false"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 448 512"
          >
            <path
              fill="green"
              d="M424.4 214.7L72.4 6.6C43.8-10.3 0 6.1 0 47.9V464c0 37.5 40.7 60.1 72.4 41.3l352-208c31.4-18.5 31.5-64.1 0-82.6z"
            />
          </svg>
        </div>
        <div
          className={styles.svgWrapper}
          onClick={() => socket.emit('youtube-sync', 'pause')}
          role="button"
          tabIndex={0}
          onKeyPress={() => socket.emit('youtube-sync', 'pause')}
        >
          <svg
            className={styles.pauseIcon}
            aria-hidden="true"
            focusable="false"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 448 512"
          >
            <path
              fill="red"
              d="M144 479H48c-26.5 0-48-21.5-48-48V79c0-26.5 21.5-48 48-48h96c26.5 0 48 21.5 48 48v352c0 26.5-21.5 48-48 48zm304-48V79c0-26.5-21.5-48-48-48h-96c-26.5 0-48 21.5-48 48v352c0 26.5 21.5 48 48 48h96c26.5 0 48-21.5 48-48z"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
