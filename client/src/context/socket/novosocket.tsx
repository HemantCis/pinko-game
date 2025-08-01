import { io } from 'socket.io-client';

const novo_socket = io("http://52.64.201.4:5000/", {
    transports: ['polling'],
});

// const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
//     transports: ['websocket', 'polling'],
// });

// socket.on('connect', () => {
//     console.log('Connected to WebSocket server:', process.env.NEXT_PUBLIC_SOCKET_URL);
// });

// socket.on('connect_error', (error) => {
//     console.error('Connection Error:', error.message || error);
//     console.error('Error Details:', error);
// });
// socket.on('disconnect', () => {
//     console.log('Disconnected from WebSocket server');
// });

export default novo_socket;
