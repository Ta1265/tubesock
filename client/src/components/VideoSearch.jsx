import React, { useState } from 'react';
import axios from 'axios';
import VideoListEntry from './VideoListEntry';
import '../styles/VideoSearch.css';

export default function VideoSearch({ selectVideo }) {
  const [searchVal, setSearchVal] = useState('');
  const [videoList, setVideoList] = useState([]);
  function getVideos() {
    axios.get(`/search-videos/${searchVal}`)
      // .then((results) => console.log(results))
      .then((results) => setVideoList(results.data))
      .catch((err) => console.log(err.message));
  }
  console.log('render?', searchVal);
  return (
    <div className="videoSearchWrapper">
      <div className="search">
        <input
          placeholder="Search for videos here"
          value={searchVal}
          onChange={(e) => setSearchVal(e.target.value)}
          onKeyDown={(e) => (e.key === 'Enter' && getVideos())}
        />
      </div>
      {videoList.map((video) => (
        <VideoListEntry
          key={video.id.videoId}
          video={video}
          selectVideo={selectVideo}
        />
      ))}
    </div>
  );
}
