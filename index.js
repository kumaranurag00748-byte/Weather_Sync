import express from "express";
import axios from "axios";

const app = express();
const port = 3000;
const API_URL = "https://api.openweathermap.org/data/2.5/weather";
const API_KEY = "7dcaa70e6c935e353663e106e372746e";

app.set("view engine", "ejs");
app.set("views", "./views");
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/api/weather", async (req, res) => {
  const { city, country, lat, lon } = req.query;

  if (!city && (!lat || !lon)) {
    return res.status(400).json({
      error: "Provide a city or both latitude and longitude.",
    });
  }

  try {
    const params = {
      appid: API_KEY,
      units: "metric",
    };

    if (city) {
      params.q = country ? `${city},${country}` : city;
    } else {
      params.lat = lat;
      params.lon = lon;
    }

    const response = await axios.get(API_URL, { params });
    return res.json(response.data);
  } catch (error) {
    const status = error.response?.status || 502;
    const message =
      error.response?.data?.message || "Unable to fetch weather data.";

    return res.status(status).json({ error: message });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
