import React, { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5000'); 

const VideoChat = () => {
  const localVideoRef = useRef();
  const remoteVideoRef = useRef();
  const [stream, setStream] = useState(null);
  const [peerConnection, setPeerConnection] = useState(null);
  const [roomId, setRoomId] = useState('');
  const [targetUserId, setTargetUserId] = useState('');
  const [isCalling, setIsCalling] = useState(false);


  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((localStream) => {
        setStream(localStream);
        localVideoRef.current.srcObject = localStream;
      })
      .catch((error) => {
        console.error('Error accessing media devices:', error);
      });

    // Set up WebRTC peer connections and socket.io signaling here

   
    const pc = new RTCPeerConnection();
    pc.onicecandidate = event => {
      if (event.candidate) {
        socket.emit('ice-candidate', event.candidate, targetUserId);
      }
    };
    pc.ontrack = event => {
      remoteVideoRef.current.srcObject=event.streams[0];
    };

    setPeerConnection(pc);

    // Handle incoming offers
    socket.on('offer', (offer, senderUserId) => {
      if (!isCalling) {
        setTargetUserId(senderUserId);
        setIsCalling(true);
      }

      handleIncomingOffer(offer);
    });

    // Handle incoming answers
    socket.on('answer', (answer) => {
      handleIncomingAnswer(answer);
    });

    // Handle incoming ICE candidates
    socket.on('ice-candidate', (candidate) => {
      handleIncomingICECandidate(candidate);
    });

    // Handle user disconnection
    socket.on('user-disconnected', disconnectedUserId => {
      if (targetUserId === disconnectedUserId) {
        setIsCalling(false);
        remoteVideoRef.current.srcObject=null;
      }
    });
  }, [targetUserId, isCalling]);
  const joinRoom = () => {
    socket.emit('join', roomId, socket.id);
  };

  const startCall = async () => {
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    socket.emit('offer', offer, targetUserId);
  };

  const handleIncomingOffer = async (offer) => {
    await peerConnection.setRemoteDescription(offer);
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);
    socket.emit('answer', answer, targetUserId);
  };

  const handleIncomingAnswer = async (answer) => {
    await peerConnection.setRemoteDescription(answer);
  };

  const handleIncomingICECandidate = (candidate) => {
    peerConnection.addIceCandidate(candidate);
  };



  return (
    <div>
      <div className="local-video">
        <video ref={localVideoRef} autoPlay muted />
      </div>
      <div className="remote-video">
        <video ref={remoteVideoRef} autoPlay />
      </div>
      <div>
        <input
          type="text"
          placeholder="Room ID"
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        />
        <button onClick={joinRoom}>Join Room</button>
        {isCalling && <button onClick={startCall}>Start Call</button>}
      </div>
    </div>
  );
};

export default VideoChat;
