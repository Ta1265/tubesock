import React from 'react';
import ReactDom from 'react-dom';
import App from './components/App';
import JoinPrompt from './components/JoinPrompt';
import Room from './components/Room';

ReactDom.render(
  <App
    JoinPrompt={JoinPrompt}
    Room={Room}
  />,
  document.getElementById('app'),
);
