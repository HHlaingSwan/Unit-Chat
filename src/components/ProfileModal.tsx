import { useState, useEffect } from "react";
import { type User } from "firebase/auth";

type ProfileModalProps = {
	user: User;
	isOpen: boolean;
	onClose: () => void;
	onSave: (newName: string, newPhotoURL: string) => Promise<void>;
};

const ProfileModal = ({ user, isOpen, onClose, onSave }: ProfileModalProps) => {
	const [newName, setNewName] = useState(user.displayName || "");
	const [newPhotoURL, setNewPhotoURL] = useState(user.photoURL || "");
	const [isGeneratingAvatar, setIsGeneratingAvatar] = useState(false);
	const [isSaving, setIsSaving] = useState(false);

	useEffect(() => {
		if (isOpen) {
			setNewName(user.displayName || "");
			setNewPhotoURL(user.photoURL || "");
			setIsGeneratingAvatar(false);
		}
	}, [isOpen, user]);

	const handleGenerateAvatar = () => {
		setIsGeneratingAvatar(true);
		const generatedNumber = Math.floor(Math.random() * 100) + 1;
		setNewPhotoURL(`https://avatar.iran.liara.run/public/${generatedNumber}`);
	};

	const handleSave = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!newName.trim()) return;
		setIsSaving(true);
		await onSave(newName, newPhotoURL);
		setIsSaving(false);
		onClose();
	};

	if (!isOpen) return null;

	return (
		<div
			className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm'
			onClick={onClose}>
			<div
				className='relative w-full max-w-md rounded-2xl border border-white/20 bg-gray-900 p-8 text-white shadow-2xl'
				onClick={(e) => e.stopPropagation()}>
				<h2 className='text-center text-2xl font-bold'>Edit Profile</h2>

				<form
					onSubmit={handleSave}
					className='mt-8 space-y-6'>
					<div className='flex flex-col items-center gap-4'>
						<div className='relative'>
							<img
								src={newPhotoURL}
								alt='Avatar Preview'
								className='h-24 w-24 rounded-full border-2 border-blue-400 object-cover'
								onLoad={() => setIsGeneratingAvatar(false)}
								onError={() => setIsGeneratingAvatar(false)}
							/>
							{isGeneratingAvatar && (
								<div className='absolute inset-0 flex items-center justify-center rounded-full bg-black/50'>
									<div className='h-8 w-8 animate-spin rounded-full border-4 border-solid border-white border-t-transparent'></div>
								</div>
							)}
						</div>

						<button
							type='button'
							onClick={handleGenerateAvatar}
							className='rounded-lg border border-white/30 bg-transparent py-2 px-4 text-sm font-semibold text-white transition-colors hover:bg-white/10'>
							Generate New Avatar
						</button>
					</div>

					<div>
						<label
							htmlFor='displayName'
							className='block text-sm font-medium text-white/80'>
							Display Name
						</label>
						<input
							id='displayName'
							type='text'
							value={newName}
							onChange={(e) => setNewName(e.target.value)}
							className='mt-1 w-full rounded-lg border border-white/20 bg-black/20 px-4 py-2 text-white placeholder-white/50 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400'
							required
						/>
					</div>

					<div className='!mt-8 flex justify-end gap-4'>
						<button
							type='button'
							onClick={onClose}
							className='rounded-lg border border-white/30 bg-transparent py-2 px-4 font-semibold text-white transition-colors hover:bg-white/10'>
							Cancel
						</button>
						<button
							type='submit'
							disabled={isSaving}
							className='rounded-lg bg-blue-500 py-2 px-4 font-semibold text-white transition-colors hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50'>
							{isSaving ? "Saving..." : "Save Changes"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default ProfileModal;
