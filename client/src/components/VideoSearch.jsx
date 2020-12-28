import React, { useState } from 'react';
import axios from 'axios';
import VideoListEntry from './VideoListEntry';

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
  console.log('render?', videoList);
  return (
    <div className="search">
      <input className="search-input" tpye="text" value={searchVal} onChange={(e) => setSearchVal(e.target.value)} />
      <button className="search-submit" type="button" onClick={() => getVideos()}>Search</button>
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
