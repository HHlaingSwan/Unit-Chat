import { useEffect, useState, useRef } from "react";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router";
import {
	collection,
	addDoc,
	serverTimestamp,
	query,
	orderBy,
	onSnapshot,
	Timestamp,
	doc,
	setDoc,
	deleteDoc,
	updateDoc,
	where,
} from "firebase/firestore";
import { useAuth } from "./context/AuthContext.tsx";
import { auth, db } from "./firebase.ts";
import { type Message, type OnlineUser } from "./types.ts";
import Sidebar from "./components/Sidebar.tsx";
import ChatArea from "./components/ChatArea.tsx";

const App = () => {
	useAuth();
	const user = auth.currentUser;
	const navigate = useNavigate();
	const [messages, setMessages] = useState<Message[]>([]);
	const [newMessage, setNewMessage] = useState("");
	const [typingUsers, setTypingUsers] = useState<string[]>([]);
	const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
	const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
	const [editedMessageText, setEditedMessageText] = useState("");
	const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

	// Fetch messages from Firestore in real-time
	useEffect(() => {
		const q = query(collection(db, "messages"), orderBy("createdAt", "asc"));
		const unsubscribe = onSnapshot(q, (querySnapshot) => {
			const fetchedMessages: Message[] = [];
			querySnapshot.forEach((doc) => {
				const data = doc.data();
				fetchedMessages.push({
					id: doc.id,
					...data,
					// Format the server timestamp for display
					timestamp:
						data.createdAt?.toDate().toLocaleTimeString([], {
							hour: "2-digit",
							minute: "2-digit",
						}) || "",
				} as Message);
			});
			setMessages(fetchedMessages);
		});

		return () => unsubscribe(); // Cleanup subscription on unmount
	}, []);

	// Listen for typing indicators
	useEffect(() => {
		if (!user) return;

		// Query for users who are typing and have updated in the last 10 seconds
		const tenSecondsAgo = Timestamp.fromMillis(Date.now() - 10000);
		const q = query(
			collection(db, "typing_status"),
			where("isTyping", "==", true),
			where("timestamp", ">", tenSecondsAgo)
		);

		const unsubscribe = onSnapshot(q, (snapshot) => {
			const typers: string[] = [];
			snapshot.forEach((doc) => {
				// Don't show the current user as typing to themselves
				if (doc.id !== user.uid) {
					typers.push(doc.data().name);
				}
			});
			setTypingUsers(typers);
		});

		return () => unsubscribe();
	}, [user]);

	// Manage user presence and heartbeat
	useEffect(() => {
		if (!user) return;

		const userStatusRef = doc(db, "users", user.uid);

		// Set status to online on mount
		updateDoc(userStatusRef, {
			status: "online",
			lastSeen: serverTimestamp(),
		});

		// Heartbeat interval to update lastSeen every 20 seconds
		const interval = setInterval(() => {
			updateDoc(userStatusRef, {
				lastSeen: serverTimestamp(),
			});
		}, 20000);

		return () => {
			clearInterval(interval);
		};
	}, [user]);

	// Listen for online users
	useEffect(() => {
		if (!user) return;

		// We consider users online if their lastSeen is within the last 60 seconds
		const sixtySecondsAgo = Timestamp.fromMillis(Date.now() - 60000);
		const q = query(
			collection(db, "users"),
			where("lastSeen", ">", sixtySecondsAgo)
		);

		const unsubscribe = onSnapshot(q, (snapshot) => {
			const users: OnlineUser[] = [];
			snapshot.forEach((doc) => {
				const data = doc.data();
				// Exclude the current user from the list and ensure they are "online"
				if (doc.id !== user.uid && data.status === "online") {
					users.push({
						uid: doc.id,
						name: data.name,
						photoURL: data.photoURL,
					});
				}
			});
			setOnlineUsers(users);
		});

		return () => unsubscribe();
	}, [user]);

	const handleSignOut = async () => {
		try {
			if (user) {
				await updateDoc(doc(db, "users", user.uid), { status: "offline" });
			}
			await signOut(auth);
			navigate("/"); // Navigate to the login/root page
		} catch (error) {
			console.error("Error signing out: ", error);
		}
	};

	const handleDeleteMessage = async (messageId: string) => {
		if (!window.confirm("Are you sure you want to delete this message?")) {
			return;
		}
		try {
			await deleteDoc(doc(db, "messages", messageId));
		} catch (error) {
			console.error("Error deleting message: ", error);
		}
	};

	const handleStartEdit = (message: Message) => {
		setEditingMessageId(message.id);
		setEditedMessageText(message.text || "");
	};

	const handleCancelEdit = () => {
		setEditingMessageId(null);
		setEditedMessageText("");
	};

	const handleSaveEdit = async (e: React.FormEvent, messageId: string) => {
		e.preventDefault();
		if (editedMessageText.trim() === "") return;

		try {
			const messageRef = doc(db, "messages", messageId);
			await updateDoc(messageRef, {
				text: editedMessageText,
				editedAt: serverTimestamp(),
			});
			handleCancelEdit();
		} catch (error) {
			console.error("Error updating message: ", error);
		}
	};

	const updateTypingStatus = async (isTyping: boolean) => {
		if (!user) return;
		const typingRef = doc(db, "typing_status", user.uid);
		if (isTyping) {
			await setDoc(typingRef, {
				isTyping: true,
				name: user.displayName || "User",
				timestamp: serverTimestamp(),
			});
		} else {
			await deleteDoc(typingRef);
		}
	};

	const handleSendMessage = async (e: React.FormEvent) => {
		e.preventDefault();
		if (newMessage.trim() === "" || !user) return;

		// Clear typing indicator immediately
		if (typingTimeoutRef.current) {
			clearTimeout(typingTimeoutRef.current);
			typingTimeoutRef.current = null;
		}
		await updateTypingStatus(false);

		const messagePayload = {
			text: newMessage,
			createdAt: serverTimestamp(),
			user: {
				uid: user.uid,
				name: user.displayName || "User",
				avatar:
					user.photoURL ||
					`https://api.dicebear.com/7.x/initials/svg?seed=${user.uid}`,
			},
		};

		try {
			// Add a new document with a generated id.
			await addDoc(collection(db, "messages"), messagePayload);
			setNewMessage("");
		} catch (error) {
			console.error("Error sending message: ", error);
		}
	};

	const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
		setNewMessage(e.target.value);

		if (!user) return;

		if (typingTimeoutRef.current) {
			clearTimeout(typingTimeoutRef.current);
		} else {
			updateTypingStatus(true);
		}

		typingTimeoutRef.current = setTimeout(() => {
			updateTypingStatus(false);
			typingTimeoutRef.current = null;
		}, 3000); // User is considered "stopped" after 3 seconds of inactivity
	};

	// If auth is still initializing or the user has been signed out,
	// auth.currentUser will be null. ProtectedRoute should handle redirection,
	// but this prevents rendering errors in the meantime.
	if (!user) {
		return null;
	}

	return (
		<div className='relative flex h-screen w-screen items-center justify-center'>
			<img
				src='/bg.png'
				alt='background'
				className='absolute top-0 left-0 h-full w-full object-cover'
			/>
			<div className='relative flex h-[90vh] w-full max-w-6xl rounded-2xl border border-white/20 bg-black/30 text-white shadow-2xl backdrop-blur-lg'>
				<Sidebar
					user={user}
					onlineUsers={onlineUsers}
					onSignOut={handleSignOut}
				/>
				<ChatArea
					user={user}
					messages={messages}
					typingUsers={typingUsers}
					editingMessageId={editingMessageId}
					editedMessageText={editedMessageText}
					newMessage={newMessage}
					onStartEdit={handleStartEdit}
					onCancelEdit={handleCancelEdit}
					onSaveEdit={handleSaveEdit}
					onDeleteMessage={handleDeleteMessage}
					setEditedMessageText={setEditedMessageText}
					onSendMessage={handleSendMessage}
					onTyping={handleTyping}
				/>
			</div>
		</div>
	);
};

export default App;
