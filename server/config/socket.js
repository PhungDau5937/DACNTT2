const socketIo = require('socket.io');
const Chat = require('../scr/models/Chat'); // Đảm bảo đường dẫn đúng
const User = require('../scr/models/User'); // Đảm bảo đường dẫn đúng

const setupSocket = (server) => {
    const io = require('socket.io')(server, {
        cors: {
            origin: 'http://localhost:3000',
            methods: ["GET", "POST"],
            credentials: true,
        }
    });

    io.on('connection', (socket) => {
        console.log('New client connected');

        // Join the common chat room
        socket.join('common');

        // Load chat history from MongoDB and send to client
        socket.on('joinChat', async () => {
            try {
                const messages = await Chat.find({ room: 'common' }).sort({ timestamp: 1 });
                socket.emit('loadMessages', messages);
            } catch (error) {
                console.error('Error loading messages:', error);
            }
        });

        socket.on('sendMessage', async ({ sender, message }) => {
            console.log('Received sendMessage event:', { sender, message });
            try {
                // Find the user to get their lastName, firstName, and role
                const user = await User.findById(sender);
                if (!user) {
                    throw new Error('User not found');
                }

                const newMessage = new Chat({
                    room: 'common',
                    sender: sender,
                    message,
                    timestamp: new Date() // Đảm bảo trường timestamp tồn tại trong schema
                });

                await newMessage.save();

                // Prepare the message to include user details
                const messageWithUserDetails = {
                    ...newMessage.toObject(),
                    sender: {
                        _id: user._id,
                        lastName: user.lastName,
                        firstName: user.firstName,
                        avatar: user.avatar,
                        role: user.role
                    }
                };

                // Broadcast message to all users in the room
                io.to('common').emit('receiveMessage', messageWithUserDetails);
            } catch (error) {
                console.error('Error sending message:', error);
            }
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected');
        });
    });

    return io;
};

module.exports = setupSocket;