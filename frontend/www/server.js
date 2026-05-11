const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors({
  origin: "*"
}));
app.use(express.json());


const cities = [
  { id: 1, name: "Buenos Aires", image: "https://images.unsplash.com/photo-1583422409516-2895a77efded" },
  { id: 2, name: "Córdoba", image: "https://images.unsplash.com/photo-1603569283847-aa295f0d016a" },
  { id: 3, name: "Mendoza", image: "https://images.unsplash.com/photo-1596495578065-6e0763fa1178" },
  { id: 4, name: "Bariloche", image: "https://images.unsplash.com/photo-1585938389612-a552a28d6914" },
  { id: 5, name: "Salta", image: "https://images.unsplash.com/photo-1615551043360-33de8b5f410c" },
  { id: 6, name: "Ushuaia", image: "https://images.unsplash.com/photo-1580910051074-3eb694886505" },
  { id: 7, name: "Rosario", image: "https://images.unsplash.com/photo-1581091215367-59ab6b1b45d1" },
  { id: 8, name: "Mar del Plata", image: "https://images.unsplash.com/photo-1596496050827-8299e0220de1" }
];


const flights = [];

cities.forEach(origin => {
  cities.forEach(dest => {
    if (origin.name !== dest.name) {
      flights.push({
        id: flights.length + 1,
        from: origin.name,
        to: dest.name,
        price: Math.floor(Math.random() * 80000) + 20000,
        duration: `${Math.floor(Math.random() * 3) + 1}h ${Math.floor(Math.random() * 59)}m`,
        airline: ["Aerolíneas", "Flybondi", "Jetsmart"][Math.floor(Math.random() * 3)]
      });
    }
  });
});


app.get('/', (req, res) => {
  res.send("API funcionando 🚀");
});

app.get('/ping', (req, res) => {
  res.send("pong");
});


app.get('/api/cities', (req, res) => {
  res.json(cities);
});

app.get('/api/flights', (req, res) => {
  const { from } = req.query;

  if (from) {
    return res.json(flights.filter(f => f.from === from));
  }

  res.json(flights);
});


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});
