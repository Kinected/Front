export const getResponse = async (formData: FormData) => {
  const response = await fetch(`http://localhost:8000/api/audio/chatvoc`, {
    method: "POST",
    body: formData,
  });
  return await response.json();
};
