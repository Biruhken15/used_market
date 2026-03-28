import PusherClient from 'pusher-js';

const pusherClient = new PusherClient(process.env.NEXT_PUBLIC_PUSHER_KEY || 'a11288e96541b285da00', {
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || 'eu',
    forceTLS: true,
});

export default pusherClient;
