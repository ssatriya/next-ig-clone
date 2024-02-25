import { create } from "zustand";

type PostModalStore = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export const usePostCloseConfirmationModal = create<PostModalStore>((set) => ({
  type: undefined,
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
