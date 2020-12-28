import React from 'react';

export default function VideoListEntry({ video, selectVideo }) {
  return (

    <div
      role="button"
      onClick={() => selectVideo(video.id.videoId)}
      onKeyPress={() => selectVideo(video)}
      tabIndex="0"
    >
      <img className="video-thumbnail" src={video.snippet.thumbnails.default.url} alt="" />
      <div className="video-title">{video.snippet.title}</div>
    </div>
  );
}
