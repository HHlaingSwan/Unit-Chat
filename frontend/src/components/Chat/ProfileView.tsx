import { useState, useEffect, type ChangeEvent } from "react";
import useAuthStore from "../../store/useAuthStore";
import { useNavigate } from "react-router";
import type { User } from "../../types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  Crown,
  User as UserIcon,
  Palette,
  Bell,
  LogOut,
  ChevronRight,
  Loader,
} from "lucide-react";

interface ProfileViewProps {
  user?: User;
}

const ProfileView = ({ user }: ProfileViewProps) => {
  const { authUser, logout, updateUser, isKing, isLoading } = useAuthStore();
  const navigate = useNavigate();

  // Determine which user to display. Fallback to authUser if no prop is passed.
  const displayUser = user || authUser;
  // We can only edit the authUser
  const canEdit = !user;

  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  // Username is not editable, so we don't need a state for it
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);

  useEffect(() => {
    // If authUser changes, clear any pending profile image file
    if (authUser) {
      setProfileImageFile(null);
    }
  }, [authUser]);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleSaveProfile = async () => {
    if (authUser) {
      const updatedUser: Partial<User> = {}; // No username to update
      await updateUser(updatedUser, profileImageFile as File);
      setIsEditingProfile(false);
      setProfileDialogOpen(false);
    }
  };

  const handleEditClick = () => {
    setIsEditingProfile(true);
    setProfileDialogOpen(true);
  };

  return (
    <div className="flex flex-col h-full bg-black/30">
      {/* Profile Header */}
      <div className="flex flex-col items-center p-6 gap-2 border-b border-white/10">
        <div className="relative">
          <img
            src={displayUser?.profileImage || "login.png"}
            alt={displayUser?.username}
            className="w-24 h-24 rounded-full object-cover border-2 border-indigo-500"
          />
        </div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          {displayUser?.username}
          {((canEdit && isKing) ||
            displayUser?._id === "694df5158cb375c4c160fa72") && (
            <Crown className="w-6 h-6 text-yellow-400" />
          )}
        </h2>
        <p className="text-sm text-gray-400">{displayUser?.email}</p>
      </div>

      {/* Options List - only for authUser */}
      {canEdit && (
        <div className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-2">
            {/* Edit Profile */}
            <li>
              <button
                onClick={handleEditClick}
                className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-white/10 transition-colors active:bg-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <div className="flex items-center gap-4">
                  <UserIcon className="w-5 h-5 text-gray-400" />
                  <span className="font-medium">Edit Profile</span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-500" />
              </button>
            </li>
            {/* Appearance */}
            <li>
              <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-white/10 transition-colors active:bg-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <div className="flex items-center gap-4">
                  <Palette className="w-5 h-5 text-gray-400" />
                  <span className="font-medium">Appearance</span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-500" />
              </button>
            </li>
            {/* Notifications */}
            <li>
              <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-white/10 transition-colors active:bg-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <div className="flex items-center gap-4">
                  <Bell className="w-5 h-5 text-gray-400" />
                  <span className="font-medium">Notifications</span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-500" />
              </button>
            </li>
            {/* Divider */}
            <div className="pt-2">
              <div className="border-t border-white/10"></div>
            </div>
            {/* Logout */}
            <li>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-4 p-3 rounded-lg hover:bg-red-900/50 transition-colors active:bg-red-800/50 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Logout</span>
              </button>
            </li>
          </ul>
        </div>
      )}

      {/* Profile Edit Dialog - only for authUser */}
      {canEdit && (
        <Dialog
          open={profileDialogOpen}
          onOpenChange={(open) => {
            setProfileDialogOpen(open);
            if (!open) {
              setIsEditingProfile(false);
              setProfileImageFile(null); // Clear image preview on dialog close
            }
          }}
        >
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
                    disabled={isLoading}
                  />
                  <Input
                    value={authUser?.username} // Display current username, but disabled
                    disabled={true} // Username is not editable
                    className="cursor-not-allowed"
                  />
                  <div className="flex gap-2">
                    <Button onClick={handleSaveProfile} disabled={isLoading}>
                      {isLoading ? (
                        <Loader className="animate-spin" />
                      ) : (
                        "Save"
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setProfileDialogOpen(false)}
                      disabled={isLoading}
                    >
                      Cancel
                    </Button>
                  </div>
                </>
              ) : (
                <p className="text-center text-gray-400">
                  Click "Edit Profile" in the list to make changes.
                </p>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default ProfileView;
