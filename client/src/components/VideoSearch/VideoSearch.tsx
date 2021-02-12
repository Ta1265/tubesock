import React, { useState } from 'react';
import axios from 'axios';
import './VideoSearch.css';

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
    <div className="videoSearchWrapper">
      <div className="search">
        <input
          placeholder="Enter a YouTube video URL here"
          value={urlVal}
          onChange={(e) => setUrlVal(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && socket.emit('change-video-url', urlVal)}
        />
      </div>
      <div className="search">
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
          className="videoEntry"
          role="button"
          tabIndex={0}
          onClick={() => socket.emit('change-video-id', video.id.videoId)}
          onKeyPress={() => socket.emit('change-video-id', video.id.videoId)}
        >
          <img
            className="videoThumbnail"
            src={video.snippet.thumbnails.default.url}
            alt=""
          />
          <div className="videoTitle">{video.snippet.title}</div>
        </div>
      ))}
    </div>
  );
}
