type MessageInputProps = {
	newMessage: string;
	onSendMessage: (e: React.FormEvent) => Promise<void>;
	onTyping: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const MessageInput = ({
	newMessage,
	onSendMessage,
	onTyping,
}: MessageInputProps) => {
	return (
		<div className='border-t border-white/10 p-4'>
			<form
				onSubmit={onSendMessage}
				className='flex items-center gap-4'>
				<input
					type='text'
					value={newMessage}
					onChange={onTyping}
					placeholder='Type a message...'
					className='flex-grow rounded-lg border border-white/20 bg-black/20 px-4 py-2 text-white placeholder-white/50 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400'
				/>
				<button
					type='submit'
					className='rounded-lg bg-blue-500 px-6 py-2 font-semibold transition-colors hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50'
					disabled={!newMessage.trim()}>
					Send
				</button>
			</form>
		</div>
	);
};

export default MessageInput;
