import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

export const uploadVoiceToFirebase = async (uri: string, userId: string) => {
  const fetchResponse = await fetch(uri);
  const theBlob = await fetchResponse.blob();

  const storage = getStorage(); // Initialize storage
  const audioRef = ref(storage, `voiceCards/${userId}.m4a`); // Create a reference for the audio file

  await uploadBytes(audioRef, theBlob); // Upload the blob

  const audioUrl = await getDownloadURL(audioRef); // Get the download URL
  return {
    audioUrl
  };
};
