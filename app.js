const library = window.MUSIC_LIBRARY || [];
const $ = id => document.getElementById(id);
const audio = $('audio');
let selected = null, playingList = null, index = -1, shuffle = false, repeat = 0;
audio.volume = 0.8;
// iOS Safari manages hardware volume; this slider is hidden on iPhone.
const stored = (()=>{try{return JSON.parse(localStorage.getItem('wavebox-state')||'{}')}catch{return {}}})();
function saveState(){try{localStorage.setItem('wavebox-state',JSON.stringify({playlist:playingList?.id,index,shuffle,repeat}))}catch{}}

const make = (tag, className, text) => {const el=document.createElement(tag);if(className)el.className=className;if(text!==undefined)el.textContent=text;return el;};
function artwork(target, cover, color){target.style.background=color||'#29483c';target.replaceChildren();if(cover){const img=make('img');img.src=cover;img.alt='Cover art';img.onerror=()=>img.remove();target.append(img);}}
function renderNav(){const nav=$('playlists');nav.replaceChildren();library.forEach(p=>{const b=make('button','playlist-link'+(selected===p?' selected':''),'♫  '+p.name);b.onclick=()=>openPlaylist(p);nav.append(b);});}
function renderHome(){selected=null;$('pageTitle').textContent='Your Library';$('pageSubtitle').textContent='All your playlists in one place.';$('overview').hidden=false;$('tracksSection').hidden=true;const cards=$('cards');cards.replaceChildren();library.forEach(p=>{const c=make('button','playlist-card');const art=make('div','card-art');artwork(art,p.cover,p.color);c.append(art,make('strong','',p.name),make('span','',`${p.songs.length} songs · ${p.description||''}`));c.onclick=()=>openPlaylist(p);cards.append(c);});renderNav();}
function openPlaylist(p){selected=p;$('pageTitle').textContent=p.name;$('pageSubtitle').textContent=`${p.description||'Your music'} · ${p.songs.length} songs`;$('overview').hidden=true;$('tracksSection').hidden=false;renderTracks();renderNav();}
function renderTracks(){const root=$('tracks');root.replaceChildren();if(!selected)return;if(!selected.songs.length){root.append(make('p','empty','This playlist is empty. Add songs in music.js.'));return;}selected.songs.forEach((song,i)=>{const row=make('button','track'+(playingList===selected&&index===i?' current':''));const num=make('span','track-num',String(i+1));const art=make('div','track-art');artwork(art,song.cover||selected.cover,selected.color);const info=make('div','track-info');info.append(make('strong','',song.title),make('span','',song.artist||'Unknown artist'));row.append(num,art,info,make('span','track-play','▶'));row.onclick=()=>playTrack(selected,i);root.append(row);});}
function playTrack(p,i){if(!p||!p.songs.length)return;playingList=p;index=(i+p.songs.length)%p.songs.length;const s=p.songs[index];audio.src=s.file;audio.load();$('songName').textContent=s.title;$('artistName').textContent=s.artist||'Unknown artist';artwork($('cover'),s.cover||p.cover,p.color);audio.play().catch(()=>{$('artistName').textContent='Tap Play or check your music file';});updateMediaSession(s,p);syncSheet();saveState();updatePlayButton();renderTracks();}
function updatePlayButton(){const label=audio.paused?'▶':'❚❚';$('playPause').textContent=label;$('sheetPlay').textContent=label;if('mediaSession' in navigator)navigator.mediaSession.playbackState=audio.paused?'paused':'playing';}
function nextSong(manual=false){if(!playingList)return;if(!manual&&repeat===2){audio.currentTime=0;audio.play();return;}let next=shuffle&&playingList.songs.length>1?Math.floor(Math.random()*(playingList.songs.length-1)):index+1;if(shuffle&&playingList.songs.length>1&&next>=index)next++;if(next>=playingList.songs.length){if(repeat===1)next=0;else{audio.pause();audio.currentTime=0;updatePlayButton();return;}}playTrack(playingList,next);}
function prevSong(){if(!playingList)return;if(audio.currentTime>3){audio.currentTime=0;return;}playTrack(playingList,(index-1+playingList.songs.length)%playingList.songs.length);}
function time(n){if(!Number.isFinite(n))return'0:00';return`${Math.floor(n/60)}:${String(Math.floor(n%60)).padStart(2,'0')}`;}
$('homeBtn').onclick=renderHome;
$('mobileHome').onclick=()=>{hideSheet();renderHome();window.scrollTo(0,0)};
$('mobileLibrary').onclick=()=>{hideSheet();renderHome();document.getElementById('cards').scrollIntoView({behavior:'smooth'})};
$('mobileNow').onclick=()=>{$('mobileSheet').hidden=false;syncSheet()};
$('closeSheet').onclick=hideSheet;
function hideSheet(){$('mobileSheet').hidden=true}
function syncSheet(){if(!playingList||index<0)return;const song=playingList.songs[index];$('sheetTitle').textContent=song.title;$('sheetArtist').textContent=song.artist||'Unknown artist';artwork($('sheetArt'),song.cover||playingList.cover,playingList.color)}
$('sheetPlay').onclick=()=>$('playPause').click();$('sheetNext').onclick=()=>$('next').click();$('sheetPrev').onclick=()=>$('prev').click();
$('playAll').onclick=()=>{if(selected?.songs.length)playTrack(selected,0);};
$('playPause').onclick=()=>{if(!audio.src){const p=selected||library.find(p=>p.songs.length);if(p)playTrack(p,0);}else if(audio.paused)audio.play().catch(()=>{});else audio.pause();};
$('next').onclick=()=>nextSong(true);$('prev').onclick=prevSong;
$('shuffle').onclick=()=>{shuffle=!shuffle;$('shuffle').classList.toggle('enabled',shuffle);$('shuffle').setAttribute('aria-pressed',String(shuffle));saveState();};
$('repeat').onclick=()=>{repeat=(repeat+1)%3;$('repeat').textContent=repeat===2?'↻₁':'↻';$('repeat').classList.toggle('enabled',repeat!==0);$('repeat').title=['Repeat: off','Repeat: playlist','Repeat: one'][repeat];saveState();};
$('volume').oninput=e=>audio.volume=Number(e.target.value);
$('seek').oninput=e=>{if(Number.isFinite(audio.duration))audio.currentTime=Number(e.target.value)/100*audio.duration;};
audio.ontimeupdate=()=>{$('currentTime').textContent=time(audio.currentTime);$('seek').value=audio.duration?String(audio.currentTime/audio.duration*100):'0';};
audio.onloadedmetadata=()=>{$('duration').textContent=time(audio.duration);};
audio.onended=()=>nextSong();audio.onplay=updatePlayButton;audio.onpause=updatePlayButton;
audio.onerror=()=>{if(audio.src){$('artistName').textContent='File not found or unsupported — check music.js';}};
function updateMediaSession(song, playlist){
  if(!('mediaSession' in navigator))return;
  const art=song.cover||playlist.cover;
  navigator.mediaSession.metadata=new MediaMetadata({title:song.title,artist:song.artist||'Unknown artist',album:playlist.name,artwork:art?[{src:new URL(art,location.href).href,sizes:'512x512'}]:[]});
}
if('mediaSession' in navigator){
  const actions={play:()=>audio.play().catch(()=>{}),pause:()=>audio.pause(),previoustrack:prevSong,nexttrack:()=>nextSong(true),seekto:e=>{if(Number.isFinite(e.seekTime))audio.currentTime=e.seekTime}};
  for(const [name,fn] of Object.entries(actions)){try{navigator.mediaSession.setActionHandler(name,fn)}catch{}}
}
if(stored.shuffle)$('shuffle').click();
if([1,2].includes(stored.repeat))for(let i=0;i<stored.repeat;i++)$('repeat').click();
renderHome();
if('serviceWorker' in navigator && location.protocol==='https:')navigator.serviceWorker.register('./sw.js').catch(()=>{});
