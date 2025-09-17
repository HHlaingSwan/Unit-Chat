import { type User } from "firebase/auth";
import { type OnlineUser } from "../types";

type SidebarProps = {
	user: User;
	onlineUsers: OnlineUser[];
	onSignOut: () => void;
};

const Sidebar = ({ user, onlineUsers, onSignOut }: SidebarProps) => {
	return (
		<div className='flex w-80 flex-col border-r border-white/10'>
			{/* User Info Header */}
			<div className='flex items-center gap-4 p-4'>
				<img
					src={
						user.photoURL ||
						`https://api.dicebear.com/7.x/initials/svg?seed=${
							user.displayName || user.uid
						}`
					}
					alt='User Avatar'
					className='h-12 w-12 rounded-full border-2 border-blue-400'
				/>
				<div className='overflow-hidden'>
					<p className='truncate font-semibold'>{user.displayName || "User"}</p>
					<p className='text-sm text-white/60'>Online</p>
				</div>
			</div>
			<hr className='border-white/10' />

			{/* Online User List */}
			<div className='flex-grow overflow-y-auto p-4'>
				<h2 className='mb-4 font-bold text-white/80'>Online Users</h2>
				{onlineUsers.length > 0 ? (
					<ul className='space-y-3'>
						{onlineUsers.map((onlineUser) => (
							<li
								key={onlineUser.uid}
								className='flex items-center gap-3'>
								<div className='relative'>
									<img
										src={
											onlineUser.photoURL ||
											`https://api.dicebear.com/7.x/initials/svg?seed=${onlineUser.name}`
										}
										alt={onlineUser.name}
										className='h-8 w-8 rounded-full'
									/>
									<span className='absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-400 ring-2 ring-gray-800'></span>
								</div>
								<span className='truncate text-sm font-medium text-white/90'>
									{onlineUser.name}
								</span>
							</li>
						))}
					</ul>
				) : (
					<p className='text-sm text-white/50'>No other users are online.</p>
				)}
			</div>

			{/* Footer with Sign Out */}
			<hr className='border-white/10' />
			<div className='p-4'>
				<button
					onClick={onSignOut}
					className='w-full rounded-lg bg-red-600/90 py-2 px-4 font-semibold text-white transition-colors hover:bg-red-700/90 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-black/20'>
					Sign Out
				</button>
			</div>
		</div>
	);
};

export default Sidebar;
