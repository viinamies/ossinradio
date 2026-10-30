# Wavebox — iPhone Safari + PC

## Add music
Edit `music.js`. Add as many playlists and songs as you like. Put songs in `assets/music/` and covers in `assets/covers/`. Playlist `cover` sets the home card; song `cover` sets individual song art.

## Run
On PC, use a local web server (for example `python -m http.server 8000` in this folder), then visit http://localhost:8000. For iPhone, upload the whole folder to an HTTPS host such as GitHub Pages or Netlify. In Safari open the site, Share > Add to Home Screen.

## iPhone notes
Start playback by tapping Play. Lock-screen controls use Media Session where supported. iOS may stop playback or block transitions in the background; websites cannot override this. Hardware volume buttons control iPhone volume. The service worker caches the website interface, **not your music files**: offline music is not guaranteed. You must host the music files alongside the website.

## Test
Check play/pause, next/previous, playlist repeat, one-song repeat, shuffle, screen lock, and Bluetooth headphones on your actual iPhone.
