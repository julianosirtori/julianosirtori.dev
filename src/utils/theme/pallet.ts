export const pallets = ["red", "green", "blue", "purple"];

export const getRandomPallet = () => {
  const randomIndex = Math.floor(Math.random() * pallets.length);
  return pallets[randomIndex];
};

// TODO: fix this to be random and shared the same color between server and client
// export const palletColor = getRandomPallet();
export const palletColor = process.env.NEXT_PUBLIC_PALLET || "red";
