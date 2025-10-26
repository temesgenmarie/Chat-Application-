import { Server } from 'socket.io';
import { PrismaClient } from '@prisma/client';
import http from 'http';

const prisma = new PrismaClient();

export const initSocket = (server: http.Server) => {
  const io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    // User joins a conversation
    socket.on('joinConversation', ({ conversationId, userId }) => {
      socket.join(conversationId);
      console.log(`User ${userId} joined conversation ${conversationId}`);
    });

    // Send message
    socket.on('sendMessage', async ({ conversationId, content, senderId }) => {
      try {
        const newMessage = await prisma.message.create({
          data: { content, conversationId, senderId },
        });
        io.to(conversationId).emit('newMessage', newMessage);
      } catch (error) {
        console.error('Error sending message:', error);
      }
    });

    // Edit message
    socket.on('editMessage', async ({ messageId, newContent, conversationId }) => {
      try {
        const updatedMessage = await prisma.message.update({
          where: { id: messageId },
          data: { content: newContent },
        });
        io.to(conversationId).emit('messageUpdated', updatedMessage);
      } catch (error) {
        console.error('Error editing message:', error);
      }
    });

    // Delete message
    socket.on('deleteMessage', async ({ messageId, conversationId }) => {
      try {
        await prisma.message.delete({ where: { id: messageId } });
        io.to(conversationId).emit('messageDeleted', { messageId });
      } catch (error) {
        console.error('Error deleting message:', error);
      }
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });
};
