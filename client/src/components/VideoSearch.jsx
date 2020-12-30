import React, { useState } from 'react';
import axios from 'axios';
import VideoListEntry from './VideoListEntry';
import '../styles/VideoSearch.css';

export default function VideoSearch({ selectVideo }) {
  const [searchVal, setSearchVal] = useState('');
  const [videoList, setVideoList] = useState([]);
  function getVideos() {
    axios({
      method: 'get',
      url: 'https://www.googleapis.com/youtube/v3/search',
      params: {
        part: 'snippet',
        q: searchVal || 'Doberman Pinschers',
        maxResults: 5,
        key: 'AIzaSyBIcKqggja0nnBJc2VJPsr9wW1aI3TKSXw',
        type: 'video',
      },
    })
      .then((results) => setVideoList(results.data.items))
      .catch((error) => console.log(error.message));
  }
  console.log('render?', searchVal);
  return (
    <div className="videoSearchWrapper">
      <div className="search">
        <span className="fa fa-search" />
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
