// Add as many playlists and songs as you like.
// Files are relative to index.html. Spaces in filenames are allowed.
// Example: file: "assets/music/my song.mp3"
window.MUSIC_LIBRARY = [
  {
    id: "chill", name: "Chill Vibes", description: "Relax and unwind", color: "#3b82a0",
    cover: "", // optional: "assets/covers/chill.jpg"
    songs: [
      { title: "First Chill Song", artist: "Your Artist", file: "assets/SMC LÄHIÖROTAT - Liukuhihna feat. Rohtori Laine, Paula 07 - datatraveller.mp3", cover: "" },
      { title: "Second Chill Song", artist: "Your Artist", file: "assets/music/chill-2.mp3", cover: "" }
    ]
  },
  {
    id: "gaming", name: "Gaming Mix", description: "Music for your sessions", color: "#7855ba",
    cover: "",
    songs: [
      { title: "Game Track One", artist: "Your Artist", file: "assets/music/game-1.mp3", cover: "" },
      { title: "Game Track Two", artist: "Your Artist", file: "assets/music/game-2.mp3", cover: "" }
    ]
  },
  {
    id: "favorites", name: "Favorites", description: "Your top tracks", color: "#b65b83",
    cover: "",
    songs: [
      { title: "Favorite Song", artist: "Your Artist", file: "assets/music/favorite.mp3", cover: "" }
    ]
  }
];
