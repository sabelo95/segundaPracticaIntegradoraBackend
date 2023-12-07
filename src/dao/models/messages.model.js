import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    user: { type: String, required: true },
    message: { type: String, required: true }
});

const messagesSchema = new mongoose.Schema({
    messages: [messageSchema] 
});

const MessageModel = mongoose.model('messages', messagesSchema);

export { MessageModel };
