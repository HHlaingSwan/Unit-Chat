import { useEffect, useState, type ChangeEvent } from "react";
import useChatStore from "../../store/useChatStore";
import useAuthStore from "../../store/useAuthStore";
import { Crown } from "lucide-react";
import { useNavigate } from "react-router";
import type { User } from "../../types";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { formatLastSeen } from "../../lib/utils";

const UserSkeleton = () => {
  return (
    <div className="flex items-center p-2 mb-2 rounded-lg">
      <div className="h-10 w-10 bg-slate-800 rounded-full mr-4 animate-pulse" />
      <div className="h-4 w-24 bg-slate-800 rounded animate-pulse" />
    </div>
  );
};

const Sidebar = () => {
  const {
    users,
    selectUser,
    selectedUser,
    isUsersLoading,
    getUsers,
    onlineUsers,
  } = useChatStore();
  const { authUser, logout, updateUser, isKing } = useAuthStore();
  const navigate = useNavigate();

  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [username, setUsername] = useState(authUser?.username || "");
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);

  useEffect(() => {
    if (authUser) {
      setUsername(authUser.username);
    }
  }, [authUser]);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleSaveProfile = async () => {
    if (authUser) {
      const updatedUser: Partial<User> = { username };
      await updateUser(updatedUser, profileImageFile as File);
      setIsEditingProfile(false);
      setProfileDialogOpen(false);
    }
  };

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  return (
    <div className="flex flex-col border-r border-white/20  h-full w-full p-4">
      {/* User Profile Section */}
      <div
        className="relative flex items-center gap-4 p-3 rounded-md cursor-pointer hover:bg-white/10"
        onClick={() => setProfileDialogOpen(true)}
      >
        <div className="relative">
          <img
            src={authUser?.profileImage || "login.png"}
            alt={authUser?.username}
            className="w-12 h-12 rounded-full"
          />
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-800"></div>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold truncate">
            {authUser?.username}
            {isKing && (
              <span className="text-yellow-400 ml-2">
                <Crown className="inline-block w-6 h-6 " />
              </span>
            )}
          </h3>
        </div>
      </div>

      {/* Conversations List */}
      <h2 className="text-xl font-bold my-4">Conversations</h2>
      <ul className="flex-1 overflow-y-auto">
        {isUsersLoading
          ? [...Array(5)].map((_, i) => <UserSkeleton key={`skeleton-${i}`} />)
          : users
              .filter((user) => user.username !== authUser?.username)
              .map((user) => {
                const isOnline = onlineUsers.includes(user._id);
                return (
                  <li
                    key={`${user.email}-${user._id}`}
                    className={`flex items-center p-2 mb-2 rounded-lg ${
                      selectedUser?._id === user._id
                        ? "bg-white/20 cursor-default"
                        : "hover:bg-white/10 cursor-pointer"
                    }`}
                    onClick={() =>
                      selectedUser?._id !== user._id && selectUser(user)
                    }
                  >
                    <div className="relative">
                      <img
                        src={user.profileImage || "/login.png"}
                        alt={user.username}
                        className="w-10 h-10 rounded-full mr-4"
                      />
                      {isOnline && (
                        <div className="absolute bottom-0 right-4 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-800"></div>
                      )}
                    </div>
                    <div>
                      <span className="font-semibold">
                        {user.username}
                        {user?._id === "694df5158cb375c4c160fa72" && (
                          <span className="text-yellow-400 ml-2">
                            <Crown className="inline-block w-6 h-6 " />
                          </span>
                        )}
                      </span>
                      {!isOnline && user.lastSeen && (
                        <p className="text-xs text-gray-400">
                          {formatLastSeen(user.lastSeen)}
                        </p>
                      )}
                    </div>
                  </li>
                );
              })}
      </ul>

      {/* Profile Dialog */}
      <Dialog open={profileDialogOpen} onOpenChange={setProfileDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isEditingProfile ? "Edit Profile" : "Profile"}
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4">
            <img
              src={
                profileImageFile
                  ? URL.createObjectURL(profileImageFile)
                  : authUser?.profileImage || "login.png"
              }
              alt={authUser?.username}
              className="w-32 h-32 rounded-full object-cover"
            />
            {isEditingProfile ? (
              <>
                <Input
                  type="file"
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setProfileImageFile(
                      e.target.files ? e.target.files[0] : null
                    )
                  }
                />
                <Input
                  value={username}
                  disabled
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setUsername(e.target.value)
                  }
                />
                <div className="flex gap-2">
                  <Button onClick={handleSaveProfile}>Save</Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsEditingProfile(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold">{authUser?.username}</h2>
                <p className="text-gray-500">{authUser?.email}</p>
                <div className="flex gap-2">
                  <Button onClick={() => setIsEditingProfile(true)}>
                    Edit
                  </Button>
                  <Button onClick={handleLogout} variant="destructive">
                    Logout
                  </Button>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Sidebar;
