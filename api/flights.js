export default function handler(req, res) {
  const { from } = req.query;

  res.status(200).json([
    {
      from,
      to: "Mendoza",
      price: 55000,
      airline: "FlyBondi"
    }
  ]);
}