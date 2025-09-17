import { type Timestamp } from "firebase/firestore";

export type Message = {
	id: string;
	text: string;
	timestamp: string; // For display
	createdAt?: Timestamp;
	editedAt?: Timestamp;
	user: {
		uid: string;
		name: string;
		avatar: string;
	};
};

export type OnlineUser = {
	uid: string;
	name: string;
	photoURL: string;
};
