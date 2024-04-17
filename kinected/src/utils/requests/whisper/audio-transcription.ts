export const getTranscription = async (formData: FormData) => {
  const response = await fetch(
    `http://localhost:8000/api/whisper/audio/transcription`,
    {
      method: "POST",
      body: formData,
    },
  );
  return await response.json();
};
