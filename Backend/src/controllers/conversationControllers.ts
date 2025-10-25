import { Request, Response } from "express";
import prisma from "../config/db";

export const getConversations = async (req: Request, res: Response) => {
  const userId = (req as any).userId;

  try {
    // Fetch all conversations for the user
    const conversations = await prisma.conversation.findMany({
      where: {
        OR: [{ participantOne: userId }, { participantTwo: userId }],
      },
      include: {
        messages: {
          take: 1,
          orderBy: { createdAt: "desc" },
          select: { content: true, createdAt: true, senderId: true },
        },
        participantOneUser: { select: { username: true } },
        participantTwoUser: { select: { username: true } },
      },
    });

    // Sort conversations manually by last message timestamp
    const sorted = conversations.sort((a, b) => {
      const aTime = a.messages[0]?.createdAt?.getTime() ?? 0;
      const bTime = b.messages[0]?.createdAt?.getTime() ?? 0;
      return bTime - aTime; // newest first
    });

    const result = sorted.map((c) => ({
      conversation_id: c.id,
      participant_name:
        c.participantOne === userId
          ? c.participantTwoUser?.username
          : c.participantOneUser?.username,
      last_message: c.messages[0]?.content ?? null,
      last_message_time: c.messages[0]?.createdAt ?? null,
      last_message_sender_id: c.messages[0]?.senderId ?? null,
    }));

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
