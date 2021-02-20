import React, { useState } from 'react';
import axios from 'axios';
import styles from './VideoSearch.module.css';

interface Props {
  socket: SocketIOClient.Socket;
}

export default function VideoSearch({ socket }: Props): JSX.Element {
  const [searchVal, setSearchVal] = useState<string>('');
  const [videoList, setVideoList] = useState<Array<any>>([]);
  const [urlVal, setUrlVal] = useState('');
  function getVideos() {
    axios
      .get(`/search-videos/${searchVal}`)
      .then((results) => setVideoList(results.data))
      .catch((err) => err.message);
  }

  return (
    <div className={styles.videoSearchWrapper}>
      <div className={styles.search}>
        <input
          placeholder="Enter a YouTube video URL here"
          value={urlVal}
          onChange={(e) => setUrlVal(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && socket.emit('change-video-url', urlVal)}
        />
      </div>
      <div className={styles.search}>
        <input
          placeholder="Search for videos by key words here"
          value={searchVal}
          onChange={(e) => setSearchVal(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && getVideos()}
        />
      </div>
      {videoList.map((video) => (
        <div
          key={video.id.videoId}
          className={styles.videoEntry}
          role="button"
          tabIndex={0}
          onClick={() => socket.emit('change-video-id', video.id.videoId)}
          onKeyPress={() => socket.emit('change-video-id', video.id.videoId)}
        >
          <img
            className={styles.videoThumbnail}
            src={video.snippet.thumbnails.default.url}
            alt=""
          />
          <div className={styles.videoTitle}>{video.snippet.title}</div>
        </div>
      ))}
    </div>
  );
}
