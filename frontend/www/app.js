const citiesContainer = document.getElementById('cities');
const flightsContainer = document.getElementById('flights');
const loading = document.getElementById('loading');
const priceFilter = document.getElementById('priceFilter');
const historyList = document.getElementById('history');
const toast = document.getElementById('toast');


let allFlights = [];
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
let history = JSON.parse(localStorage.getItem("history")) || [];

// 🔥 IMPORTANTE (cambiá esto si usás celular)
const API_URL = "";

// 🟢 Toast
function showToast(msg) {
  toast.innerText = msg;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2000);
}

function showLoading(){ loading.classList.remove('d-none'); }
function hideLoading(){ loading.classList.add('d-none'); }

// 🌍 MAPA
let map = L.map('map').setView([-38.4161, -63.6167], 4);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

const cityCoords = {
  "Buenos Aires": [-34.6037, -58.3816],
  "Catamarca": [-28.4696, -65.7852],
  "Chaco": [-27.4514, -58.9867],
  "Chubut": [-43.3000, -65.1000],
  "Córdoba": [-31.4201, -64.1888],
  "Corrientes": [-27.4692, -58.8306],
  "Entre Ríos": [-31.7333, -60.5333],
  "Formosa": [-26.1849, -58.1731],
  "Jujuy": [-24.1858, -65.2995],
  "La Pampa": [-36.6167, -64.2833],
  "La Rioja": [-29.4131, -66.8558],
  "Mendoza": [-32.8895, -68.8458],
  "Misiones": [-27.3621, -55.9009],
  "Neuquén": [-38.9516, -68.0591],
  "Río Negro": [-40.8135, -62.9967],
  "Salta": [-24.7829, -65.4232],
  "San Juan": [-31.5375, -68.5364],
  "San Luis": [-33.2950, -66.3356],
  "Santa Cruz": [-51.6230, -69.2168],
  "Santa Fe": [-31.6333, -60.7000],
  "Santiago del Estero": [-27.7951, -64.2615],
  "Tierra del Fuego": [-54.8019, -68.3030],
  "Tucumán": [-26.8083, -65.2176]
};


let planeMarker;
let routeLine;

const planeIcon = L.icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/34/34627.png",
  iconSize: [40, 40]
});

// 📍 Marcadores
Object.keys(cityCoords).forEach(city => {
  L.marker(cityCoords[city]).addTo(map)
    .bindPopup(`<b>${city}</b><br>
    <button onclick="getFlights('${city}')" class="btn btn-sm btn-primary mt-1">
    Ver vuelos ✈️</button>`);
});

// 🏙️ FALLBACK CIUDADES
const localCities = [
  { name: "Buenos Aires", image: "https://source.unsplash.com/400x300/?buenosaires,city" },
  { name: "Catamarca", image: "https://source.unsplash.com/400x300/?catamarca,mountains" },
  { name: "Chaco", image: "https://source.unsplash.com/400x300/?chaco,forest" },
  { name: "Chubut", image: "https://source.unsplash.com/400x300/?patagonia,landscape" },
  { name: "Córdoba", image: "https://source.unsplash.com/400x300/?cordoba,sierras" },
  { name: "Corrientes", image: "https://source.unsplash.com/400x300/?corrientes,river" },
  { name: "Entre Ríos", image: "https://source.unsplash.com/400x300/?entrerios,nature" },
  { name: "Formosa", image: "https://source.unsplash.com/400x300/?formosa,jungle" },
  { name: "Jujuy", image: "https://source.unsplash.com/400x300/?jujuy,mountains" },
  { name: "La Pampa", image: "https://source.unsplash.com/400x300/?lapampa,field" },
  { name: "La Rioja", image: "https://source.unsplash.com/400x300/?larioja,desert" },
  { name: "Mendoza", image: "https://source.unsplash.com/400x300/?mendoza,wine" },
  { name: "Misiones", image: "https://source.unsplash.com/400x300/?iguazu,waterfall" },
  { name: "Neuquén", image: "https://source.unsplash.com/400x300/?neuquen,mountains" },
  { name: "Río Negro", image: "https://source.unsplash.com/400x300/?bariloche,lake" },
  { name: "Salta", image: "https://source.unsplash.com/400x300/?salta,landscape" },
  { name: "San Juan", image: "https://source.unsplash.com/400x300/?sanjuan,argentina" },
  { name: "San Luis", image: "https://source.unsplash.com/400x300/?sanluis,nature" },
  { name: "Santa Cruz", image: "https://source.unsplash.com/400x300/?glacier,patagonia" },
  { name: "Santa Fe", image: "https://source.unsplash.com/400x300/?rosario,city" },
  { name: "Santiago del Estero", image: "https://source.unsplash.com/400x300/?santiago,forest" },
  { name: "Tierra del Fuego", image: "https://source.unsplash.com/400x300/?ushuaia,patagonia" },
  { name: "Tucumán", image: "https://source.unsplash.com/400x300/?tucuman,green" }
];

// 🚀 CARGA AUTOMÁTICA (FUNCIONA EN CELULAR Y VERCEL)
loadCities();

function loadCities() {
  fetch(`/api/cities`)
    .then(res => res.json())
    .then(data => renderCities(data))
    .catch(() => {
      console.log("⚠️ backend caído → usando ciudades locales");
      renderCities(localCities);
    });
}

// 🏙️ CARGAR CIUDADES
function loadCities() {
  fetch(`${API_URL}/api/cities`)
    .then(res => res.json())
    .then(data => renderCities(data))
    .catch(() => {
      console.log("⚠️ backend caído → usando ciudades locales");
      renderCities(localCities);
    });
}

// ✈️ FALLBACK VUELOS
function getLocalFlights(city) {
  return [
    { id: 1, from: city, to: "Buenos Aires", price: 500, airline: "LATAM", duration: "2h" },
    { id: 2, from: city, to: "Córdoba", price: 300, airline: "Flybondi", duration: "1h" },
    { id: 3, from: city, to: "Mendoza", price: 450, airline: "Aerolineas", duration: "2h" }
  ];
}

// ✈️ VUELOS
function getFlights(city) {
  showLoading();

  history.unshift(city);
  localStorage.setItem("history", JSON.stringify(history));
  renderHistory();

  fetch(`${API_URL}/api/flights?from=${city}`)
    .then(res => res.json())
    .then(data => {
      allFlights = data;
      renderFlights(data);
      hideLoading();
    })
    .catch(() => {
      console.log("⚠️ backend caído → vuelos locales");
      const data = getLocalFlights(city);
      allFlights = data;
      renderFlights(data);
      hideLoading();
    });

  if(cityCoords[city]){
    map.flyTo(cityCoords[city], 6);
  }
}

// 🎨 Render ciudades
function renderCities(data) {
  citiesContainer.innerHTML = "";

  data.forEach((city, index) => {
    citiesContainer.innerHTML += `
      <div class="col-md-4 fade-in" style="animation-delay:${index * 0.1}s">
        <div class="card mb-3">
          <img src="${city.image}" class="card-img-top">
          <div class="card-body text-center">
            <h5>${city.name}</h5>
            <button class="btn btn-primary" onclick="getFlights('${city.name}')">
              Ver vuelos
            </button>
          </div>
        </div>
      </div>
    `;
  });
}

// 🎨 Render vuelos
function renderFlights(flights) {
  flightsContainer.innerHTML = "";

  flights.forEach((f, index) => {
    const isFav = favorites.includes(f.id);

    flightsContainer.innerHTML += `
      <div class="col-md-4 fade-in">
        <div class="card mb-3">
          <div class="card-body">
            <div class="d-flex justify-content-between">
              <h5>${f.from} → ${f.to}</h5>
              <span class="favorite ${isFav ? "active" : ""}" onclick="toggleFav(${f.id})">❤️</span>
            </div>

            <p>💲 ${f.price}</p>

            <button class="btn btn-outline-primary" onclick='showDetails(${JSON.stringify(f)})'>
              Ver detalles
            </button>

            <button class="btn btn-success mt-2" onclick="animateFlight('${f.from}','${f.to}')">
              Ver ruta ✈️
            </button>
          </div>
        </div>
      </div>
    `;
  });
}

// 🛫 Animación avión
function animateFlight(from, to) {
  const start = cityCoords[from];
  const end = cityCoords[to];

  if (!start || !end) return;

  if (planeMarker) map.removeLayer(planeMarker);
  if (routeLine) map.removeLayer(routeLine);

  routeLine = L.polyline([start, end], {
    color: 'blue',
    dashArray: '10,10'
  }).addTo(map);

  map.fitBounds(routeLine.getBounds());

  planeMarker = L.marker(start, { icon: planeIcon }).addTo(map);

  let progress = 0;

  const interval = setInterval(() => {
    progress += 0.02;
    if (progress >= 1) clearInterval(interval);

    const lat = start[0] + (end[0] - start[0]) * progress;
    const lng = start[1] + (end[1] - start[1]) * progress;

    planeMarker.setLatLng([lat, lng]);
  }, 50);
}

// ❤️ Favoritos
function toggleFav(id) {
  if (favorites.includes(id)) {
    favorites = favorites.filter(f => f !== id);
    showToast("Quitado de favoritos");
  } else {
    favorites.push(id);
    showToast("Agregado a favoritos ❤️");
  }

  localStorage.setItem("favorites", JSON.stringify(favorites));
  renderFlights(allFlights);
}

// 📄 Modal
function showDetails(flight) {
  document.getElementById('modalTitle').innerText = `${flight.from} → ${flight.to}`;
  document.getElementById('modalBody').innerHTML = `
    <p><strong>Precio:</strong> $${flight.price}</p>
    <p><strong>Aerolínea:</strong> ${flight.airline}</p>
    <p><strong>Duración:</strong> ${flight.duration}</p>
  `;

  new bootstrap.Modal(document.getElementById('flightModal')).show();
}

// 🔍 Filtro
priceFilter.addEventListener('input', () => {
  const maxPrice = priceFilter.value;

  const filtered = allFlights.filter(f =>
    !maxPrice || f.price <= maxPrice
  );

  renderFlights(filtered);
});

// 🕘 Historial
function renderHistory() {
  historyList.innerHTML = "";
  history.slice(0,5).forEach(h => {
    historyList.innerHTML += `<li>${h}</li>`;
  });
}

// 🚀 INIT
loadCities();
renderHistory();