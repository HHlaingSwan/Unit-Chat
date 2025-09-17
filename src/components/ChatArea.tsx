import { useEffect, useRef } from "react";
import { type User } from "firebase/auth";
import { type Message as MessageType } from "../types";
import Message from "./Message";
import MessageInput from "./MessageInput";

type ChatAreaProps = {
	user: User;
	messages: MessageType[];
	typingUsers: string[];
	editingMessageId: string | null;
	editedMessageText: string;
	newMessage: string;
	onStartEdit: (message: MessageType) => void;
	onCancelEdit: () => void;
	onSaveEdit: (e: React.FormEvent, messageId: string) => Promise<void>;
	onDeleteMessage: (messageId: string) => Promise<void>;
	setEditedMessageText: (text: string) => void;
	onSendMessage: (e: React.FormEvent) => Promise<void>;
	onTyping: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const ChatArea = (props: ChatAreaProps) => {
	const { user, messages, typingUsers, editingMessageId, editedMessageText } =
		props;
	const messagesEndRef = useRef<null | HTMLDivElement>(null);

	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

	return (
		<div className='flex flex-1 flex-col'>
			{/* Message List */}
			<div className='flex-grow space-y-4 overflow-y-auto p-6'>
				{messages.map((msg) => (
					<Message
						key={msg.id}
						message={msg}
						isCurrentUser={msg.user.uid === user.uid}
						isEditing={editingMessageId === msg.id}
						editedText={editedMessageText}
						onStartEdit={props.onStartEdit}
						onCancelEdit={props.onCancelEdit}
						onSaveEdit={props.onSaveEdit}
						onDeleteMessage={props.onDeleteMessage}
						setEditedText={props.setEditedMessageText}
					/>
				))}
				<div ref={messagesEndRef} />
			</div>

			{/* Typing Indicator */}
			<div className='h-6 px-6 pb-2'>
				{typingUsers.length > 0 && (
					<p className='text-sm italic text-white/70'>
						{typingUsers.slice(0, 2).join(", ")}
						{typingUsers.length > 2
							? ` and ${typingUsers.length - 2} more`
							: ""}
						{typingUsers.length > 1 ? " are" : " is"} typing...
					</p>
				)}
			</div>

			{/* Message Input */}
			<MessageInput
				newMessage={props.newMessage}
				onSendMessage={props.onSendMessage}
				onTyping={props.onTyping}
			/>
		</div>
	);
};

export default ChatArea;
