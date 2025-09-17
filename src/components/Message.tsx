import { type Message as MessageType } from "../types";

type MessageProps = {
	message: MessageType;
	isCurrentUser: boolean;
	isEditing: boolean;
	editedText: string;
	onStartEdit: (message: MessageType) => void;
	onCancelEdit: () => void;
	onSaveEdit: (e: React.FormEvent, messageId: string) => Promise<void>;
	onDeleteMessage: (messageId: string) => Promise<void>;
	setEditedText: (text: string) => void;
};

const Message = ({
	message,
	isCurrentUser,
	isEditing,
	editedText,
	onStartEdit,
	onCancelEdit,
	onSaveEdit,
	onDeleteMessage,
	setEditedText,
}: MessageProps) => {
	const messageContainerClass = isCurrentUser ? "justify-end" : "justify-start";

	const renderMessageContent = () => {
		if (isEditing) {
			return (
				<form
					onSubmit={(e) => onSaveEdit(e, message.id)}
					className='w-full max-w-md'>
					<input
						type='text'
						value={editedText}
						onChange={(e) => setEditedText(e.target.value)}
						className='w-full rounded-lg border border-blue-400 bg-black/50 px-3 py-2 text-sm text-white focus:outline-none'
						autoFocus
						onKeyDown={(e) => {
							if (e.key === "Escape") onCancelEdit();
						}}
					/>
					<div className='mt-2 flex justify-end gap-3 text-xs'>
						<button
							type='button'
							onClick={onCancelEdit}
							className='font-semibold hover:underline'>
							Cancel
						</button>
						<button
							type='submit'
							className='font-semibold text-blue-400 hover:underline'>
							Save
						</button>
					</div>
				</form>
			);
		}

		const bubbleClass = isCurrentUser ? "bg-blue-600" : "bg-white/20";
		return (
			<div
				className={`max-w-xs rounded-lg px-4 py-2 md:max-w-md ${bubbleClass}`}>
				{!isCurrentUser && (
					<p className='text-sm font-bold'>{message.user.name}</p>
				)}
				<p className='text-white'>{message.text}</p>
				<div className='mt-1 flex items-center justify-end gap-2 text-right text-xs text-white/60'>
					{message.editedAt && <span>Edited</span>}
					<span>{message.timestamp}</span>
				</div>
			</div>
		);
	};

	return (
		<div className={`group flex items-end gap-3 ${messageContainerClass}`}>
			{!isCurrentUser && (
				<img
					src={message.user.avatar}
					alt={message.user.name}
					className='h-8 w-8 rounded-full'
				/>
			)}

			{isCurrentUser && (
				<div className='flex items-center self-center opacity-0 transition-opacity group-hover:opacity-100'>
					{message.text && (
						<button
							onClick={() => onStartEdit(message)}
							className='rounded-full p-1 text-white/70 hover:bg-white/20'>
							{/* Edit Icon */}
							<svg
								xmlns='http://www.w3.org/2000/svg'
								className='h-4 w-4'
								fill='none'
								viewBox='0 0 24 24'
								stroke='currentColor'
								strokeWidth={2}>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									d='M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.536L16.732 3.732z'
								/>
							</svg>
						</button>
					)}
					<button
						onClick={() => onDeleteMessage(message.id)}
						className='rounded-full p-1 text-white/70 hover:bg-white/20'>
						{/* Delete Icon */}
						<svg
							xmlns='http://www.w3.org/2000/svg'
							className='h-4 w-4'
							fill='none'
							viewBox='0 0 24 24'
							stroke='currentColor'
							strokeWidth={2}>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
							/>
						</svg>
					</button>
				</div>
			)}

			{renderMessageContent()}

			{isCurrentUser && (
				<img
					src={message.user.avatar}
					alt={message.user.name}
					className='h-8 w-8 rounded-full'
				/>
			)}
		</div>
	);
};

export default Message;
