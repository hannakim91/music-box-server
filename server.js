const { response } = require("express");
const express = require("express");
const app = express();
const cors = require('cors');

app.use(cors());

app.use(express.json());
app.set("port", process.env.PORT || 3001);

app.locals.title = "Music Box";
app.locals.songs = [
  { id: 1, artist: "History of Color", title: "Rumba Juankita" },
  { id: 2, artist: "Tipper", title: "Dreamsters" },
  { id: 3, artist: "Barbatuques, CloZee", title: "Baiana" },
  { id: 4, artist: "Tourist", title: "Elixir" },
  { id: 5, artist: "Kilig", title: "NotForYou" },
  { id: 6, artist: "Tourist", title: "Bunny" }
]

app.get("/", (request, response) => {
  response.send(`${app.locals.title} API`);
});

app.get("/api/v1/songs", (request, response) => {
  console.log(request.params)
  response.status(200).json(app.locals.songs)
})

app.get("/api/v1/songs/artist/:artist", (request, response) => {
  const artist = request.params.artist
  console.log(artist)
  const songs = app.locals.songs.filter(song => song.artist.toLowerCase().replace(/\s/g, '') === artist.toLowerCase().replace(/\s/g, ''))
  if (!songs.length){
    response.status(404).json({error: `Music by ${artist} is not in the library`})
  }
  response.status(200).json(songs)
})

app.get("/api/v1/songs/:id", (request, response) => {
  const id = parseInt(request.params.id)
  const song = app.locals.songs.find(song => song.id === id)
  if (!song) {
    response.status(404).json({error: `Song with ${id} does not exist`})
  }
  response.status(200).json(song)
})

app.post("/api/v1/songs", (request, response) => {
  const { artist, title } = request.body
  if (!artist || !title ) {
    response.status(422).json({error: `Missing required information. Expected format {artist: <string>, title: <string}`})
  } else {
    const newSong = { id: Date.now(), artist, title }
    app.locals.songs.push(newSong)
    response.status(201).json(newSong)
  }
})

app.delete("/api/v1/songs/:id", (request, response) => {
  const id = parseInt(request.params.id)
  const match = app.locals.songs.find(song => parseInt(song.id) === id)

  if (!match) {
    return response.status(404).json({ error: `No song found that matches id ${id}`})
  }

  const updatedSongList = app.locals.songs.filter(song => parseInt(song.id) !== id);
  app.locals.songs = updatedSongList;
  return response.status(202).json(app.locals.songs)
})

app.patch('/api/v1/songs/:id', (req, res) => {
  const song = app.locals.songs.find(song => song.id == req.params.id);
  if (!song) return res.sendStatus(404);
  song.votes++;
  res.json(song);
  // starter for upvoting songs
 });


app.listen(app.get("port"), () => {
  console.log(`${app.locals.title} is running on http://localhost:${app.get("port")}`);
});