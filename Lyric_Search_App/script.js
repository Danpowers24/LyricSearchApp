const form = document.getElementById('form');
const search = document.getElementById('search');
const result = document.getElementById('result');
const more = document.getElementById('more');
const apiUrl = 'https://api.lyrics.ovh';

// Search by song or artist
async function searchSongs(term) {
  const res = await fetch(`${apiUrl}/suggest/${term}`);
  const data = await res.json();

  showData(data);
}

// Show song and artist in DOM
function showData(data) {
  let output = '';
  
  data.data.forEach((song) => {
    output += `
    <li>
      <span>
        <strong>${song.artist.name}</strong> - ${song.title}
      </span>
      <button class="btn" data-artist="${song.artist.name}" data-songTitle="${song.title}">Get Lyrics</button>
    </li>
    `;
  });

  result.innerHTML = `
  <ul class="songs">
  ${output}
  </ul>
  `;

  if(data.prev || data.next) {
      more.innerHTML =`
        ${data.prev ? `<button class="btn" onclick="getMoreSongs('${data.prev}')">Prev</button>` : ''}
        ${data.next ? `<button class="btn" onclick="getMoreSongs('${data.next}')">Next</button>` : ''}
      `;
  } else {
        more.innerHTML = '';
  }
};

// Get prev and next songs
async function getMoreSongs(url) {
    const res = await fetch(`https://cors-anywhere.herokuapp.com/${url}`);
    const data = await res.json();

    showData(data);
};

// Event listeners
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const searchTerm = search.value.trim();
  if (!searchTerm) {
    alert('Please type in a search term');
  } else {
    searchSongs(searchTerm);
  }
});

// Get lyrics for song
async function getLyrics(artist, songTitle) {
    const res = await fetch(`${apiUrl}/v1/${artist}/${songTitle}`);
    const data = await res.json();

    const lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g, '<br>');

    result.innerHTML = `<h2><strong>${artist}</strong> - ${songTitle}</h2>
    <span>${lyrics}<span>`;

    more.innerHTML = '';
}

// Get lyrics button click
result.addEventListener('click', e => {
    const clickedEl = e.target;

    if (clickedEl.tagName === 'BUTTON') {
        // console.log('button clicked')
        const artist = clickedEl.getAttribute('data-artist');
        const songTitle = clickedEl.getAttribute('data-songTitle');
        
        getLyrics(artist, songTitle)

    }
    console.log("event is ", e)
})