export default function handler(req, res) {
  res.status(200).json([
    { name: "Buenos Aires", price: 50000 },
    { name: "Córdoba", price: 40000 },
    { name: "Mendoza", price: 45000 },
    { name: "Bariloche", price: 60000 }
  ]);
}