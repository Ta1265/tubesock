import React, { useState } from 'react';
import axios from 'axios';
import './VideoSearch.css';

export default function VideoSearch({ socket }) {
  const [searchVal, setSearchVal] = useState('');
  const [videoList, setVideoList] = useState([]);
  const [urlVal, setUrlVal] = useState('');
  function getVideos() {
    axios.get(`/search-videos/${searchVal}`)
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
          onKeyDown={(e) => (e.key === 'Enter' && socket.emit('change-video-url', urlVal))}
        />
      </div>
      <div className="search">
        <input
          placeholder="Search for videos by key words here"
          value={searchVal}
          onChange={(e) => setSearchVal(e.target.value)}
          onKeyDown={(e) => (e.key === 'Enter' && getVideos())}
        />
      </div>
      {videoList.map((video) => (
        <div
          key={video.id.videoId}
          className="videoEntry"
          role="button"
          onClick={() => socket.emit('change-video-id', video.id.videoId)}
          onKeyPress={() => socket.emit('change-video-id', video.id.videoId)}
          tabIndex="0"
        >
          <img className="videoThumbnail" src={video.snippet.thumbnails.default.url} alt="" />
          <div className="videoTitle">{video.snippet.title}</div>
        </div>
      ))}
    </div>
  );
}
