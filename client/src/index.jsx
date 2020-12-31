import React from 'react';
import ReactDom from 'react-dom';
import App from './components/App/App';
import JoinPrompt from './components/JoinPrompt/JoinPrompt';
import Room from './components/Room/Room';

ReactDom.render(
  <App
    JoinPrompt={JoinPrompt}
    Room={Room}
  />,
  document.getElementById('app'),
);
