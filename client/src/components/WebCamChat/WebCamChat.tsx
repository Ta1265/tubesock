import React, { createRef } from 'react';
import MyRTCconnector from '../../myRTCconnector';
import RemoteVideo from './RemoteVideo';
import styles from './WebCamChat.module.css';

interface Props {
  socket: SocketIOClient.Socket;
  setNumConnections: (num: number) => void;
  numConnections: number;
  roomName: string;
  userName: string;
}

interface State {
  connections: Array<Connection>;
}

interface User {
  userName: string;
  id: string;
  roomName: string;
}

interface Connection {
  socketId: string;
  rtcConnection: MyRTCconnector;
}

interface Message {
  offer: RTCSessionDescription | undefined;
  answer: RTCSessionDescription | undefined;
  iceCandidate: RTCIceCandidate | undefined;
}

export default class WebCamChat extends React.Component<Props, State> {
  public localVideoRef: React.RefObject<HTMLVideoElement>;

  constructor(props: Props) {
    super(props);
    this.state = {
      connections: [], // structure [ {socketId, rtcConnection}, ]
    };
    this.localVideoRef = createRef();
    this.disconnectCallBack = this.disconnectCallBack.bind(this);
  }

  componentDidMount(): void {
    const {
      socket, setNumConnections, roomName, userName,
    } = this.props;

    socket.on('getuptospeed-list', (usersMinusSelf: Array<User>) => {
      setNumConnections(usersMinusSelf.length + 1);
      const newConnections = usersMinusSelf.map(
        (user: User): Connection => this.createConnection(user.id),
      );
      this.setState({ connections: newConnections });
    });

    socket.on('new-user-joined', (id: string) => {
      const { connections } = this.state;
      const newConnection = this.createConnection(id);
      setNumConnections(connections.length + 1);
      this.setState({ connections: [...connections, newConnection] });
    });

    socket.on(
      'peer_connection_relay',
      (message: Message, fromId: string): void => {
        const { connections } = this.state;
        const designatedPeer = connections.filter(
          (c: Connection): boolean => c.socketId === fromId,
        );
        designatedPeer[0].rtcConnection.handleMessage(message);
      },
    );

    socket.emit('join_room', { roomName, userName });

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((localStream: MediaStream) => {
        if (this.localVideoRef.current) {
          this.localVideoRef.current.srcObject = localStream;
        }
      });
  }

  disconnectCallBack(socketId: string): void {
    const { connections } = this.state;
    const updatedConnections = connections.filter(
      (con) => con.socketId !== socketId,
    );
    this.setState({ connections: updatedConnections });
  }

  createConnection(socketId: string): Connection {
    const { socket } = this.props;
    const rtcConnection = new MyRTCconnector(
      socket,
      socketId,
      this.disconnectCallBack,
    );
    return { socketId, rtcConnection };
  }

  render(): JSX.Element {
    const { connections } = this.state;
    const { socket } = this.props;
    return (
      <div className={styles.WebCamChatContainer}>
        <div className={styles.webcamwrapper}>
          <video
            className={styles.video}
            ref={this.localVideoRef}
            autoPlay
            playsInline
            controls
            muted
          />
          {connections.map(({ rtcConnection, socketId }: Connection) => (
            <RemoteVideo key={socketId} rtcConnection={rtcConnection} />
          ))}
        </div>
      </div>
    );
  }
}
