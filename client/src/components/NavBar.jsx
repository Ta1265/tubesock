import React from 'react';
import '../styles/NavBar.css';

export default function NavBar(props) {
  const {
    userName, roomName, numConnections,
  } = props;

  return (
    <nav className="navbar">
      <div className="navIcon">
        <svg className="sockIconSvg" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 512 512">
          <path fill="black" d="M214.66 311.01L288 256V96H128v176l-86.65 64.61c-39.4 29.56-53.86 84.42-29.21 127.06C30.39 495.25 63.27 512 96.08 512c20.03 0 40.25-6.25 57.52-19.2l21.86-16.39c-29.85-55.38-13.54-125.84 39.2-165.4zM288 32c0-11.05 3.07-21.3 8.02-30.38C293.4.92 290.85 0 288 0H160c-17.67 0-32 14.33-32 32v32h160V32zM480 0H352c-17.67 0-32 14.33-32 32v32h192V32c0-17.67-14.33-32-32-32zM320 272l-86.13 64.61c-39.4 29.56-53.86 84.42-29.21 127.06 18.25 31.58 50.61 48.33 83.42 48.33 20.03 0 40.25-6.25 57.52-19.2l115.2-86.4A127.997 127.997 0 0 0 512 304V96H320v176z" />
        </svg>
      </div>
      <div className="navTitle">TubeSock</div>
      <div className="roomData">
        <div>
          Username:
          {userName || ''}
        </div>
        <div>
          Room:
          {roomName || ''}
        </div>
        <div>
          User count:
          {numConnections || ''}
        </div>
      </div>

    </nav>
  );
}
