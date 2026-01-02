import useChatStore from "../../store/useChatStore";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ContactRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ContactRequestDialog = ({
  open,
  onOpenChange,
}: ContactRequestDialogProps) => {
  const { selectedUser, acceptContact, blockContact } = useChatStore();

  if (!selectedUser) return null;

  const handleAccept = () => {
    acceptContact(selectedUser._id);
    onOpenChange(false);
  };

  const handleBlock = () => {
    blockContact(selectedUser._id);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Conversation</DialogTitle>
          <DialogDescription>
            You have a new message request from {selectedUser.username}.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-4 mt-4">
          <button
            onClick={handleBlock}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
          >
            Block
          </button>
          <button
            onClick={handleAccept}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
          >
            Accept
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContactRequestDialog;
