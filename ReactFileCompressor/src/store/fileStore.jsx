import { atom } from 'recoil';

export const FileAtom = atom({
  key: "fileAtom",
  default: {
    uploadedFiles: []  // Array to store file metadata and download URLs
  }
});
