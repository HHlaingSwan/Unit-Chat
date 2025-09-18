type ConfirmationModalProps = {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => void;
	title: string;
	message: string;
	confirmText?: string;
	cancelText?: string;
};

const ConfirmationModal = ({
	isOpen,
	onClose,
	onConfirm,
	title,
	message,
	confirmText = "Confirm",
	cancelText = "Cancel",
}: ConfirmationModalProps) => {
	if (!isOpen) return null;

	return (
		<div
			className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm'
			onClick={onClose}>
			<div
				className='relative w-full max-w-md rounded-2xl border border-white/20 bg-gray-900 p-8 text-white shadow-2xl'
				onClick={(e) => e.stopPropagation()}>
				<h2 className='text-center text-2xl font-bold'>{title}</h2>
				<p className='mt-4 text-center text-white/80'>{message}</p>

				<div className='!mt-8 flex justify-center gap-4'>
					<button
						type='button'
						onClick={onClose}
						className='rounded-lg border border-white/30 bg-transparent py-2 px-6 font-semibold text-white transition-colors hover:bg-white/10'>
						{cancelText}
					</button>
					<button
						type='button'
						onClick={onConfirm}
						className='rounded-lg bg-red-600 py-2 px-6 font-semibold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50'>
						{confirmText}
					</button>
				</div>
			</div>
		</div>
	);
};

export default ConfirmationModal;
