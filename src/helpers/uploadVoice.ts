const handleUpload = async (uri: string) => {
  // try {
  //   const formData = new FormData();
  //   formData.append('file', {
  //     uri,
  //     name: 'voicecard.m4a',
  //     type: 'audio/m4a',
  //   });

  //   const response = await axios.post(`api/upload`, formData, {
  //     headers: {
  //       'Content-Type': 'multipart/form-data',
  //     },
  //   });

  //   // Dispatch action to add the new VoiceCard with the server-provided audioUrl
  //   const newVoiceCard = {
  //     id: response.data.id,
  //     author: 'You',
  //     location: 'Your Location',
  //     timestamp: 'Just now',
  //     audioUrl: response.data.audioUrl,
  //   };
  //   dispatch(addVoiceCard(newVoiceCard));
  //   Alert.alert('Recording Uploaded', 'Your voice message has been uploaded successfully.');
  // } catch (error) {
  //   console.error('Upload failed', error);
  //   Alert.alert('Upload Failed', 'There was an error uploading your voice message.');
  // }
};