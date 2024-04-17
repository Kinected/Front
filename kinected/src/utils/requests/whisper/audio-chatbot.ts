export const getResponse = async (formData: FormData, userID: string) => {
  const response = await fetch(
    `http://localhost:8000/api/whisper/audio/chatvoc?userID=${userID}`,
    {
      method: "POST",
      body: formData,
    },
  );
  return await response.json();
};
