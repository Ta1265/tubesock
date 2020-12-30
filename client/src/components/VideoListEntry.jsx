import React from 'react';
import '../styles/VideoListEntry.css';

export default function VideoListEntry({ video, selectVideo }) {
  return (
    <div
      className="videoEntry"
      role="button"
      onClick={() => selectVideo(video.id.videoId)}
      onKeyPress={() => selectVideo(video)}
      tabIndex="0"
    >
      <img className="videoThumbnail" src={video.snippet.thumbnails.default.url} alt="" />
      <div className="videoTitle">{video.snippet.title}</div>
    </div>
  );
}
