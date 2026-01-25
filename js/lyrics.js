/**
 * Lyrics Page Functionality
 * File: js/lyrics.js
 */

document.addEventListener('DOMContentLoaded', function() {
    // Sample lyrics data (replace with real data from backend)
    const lyricsData = [
        {
            id: 1,
            artist: "Burna Boy",
            song: "Ye",
            genre: "afrobeats",
            language: "english",
            year: "2018",
            lyrics: `[VERSE 1]
Everybody die, die, die, die
Everybody live, live, live, live
It's a feeling that's so divine
Everybody shine, shine, shine, shine

[CHORUS]
Ye, ye, ye, ye
Ye, ye, ye, ye
Ye, ye, ye, ye
Ye, ye, ye, ye

[VERSE 2]
Money fall on you like rain
Everything you do, you do with grace
Everybody know your name
You dey shine like diamond in the rain`,
            preview: "Everybody die, die, die, die... Everybody live, live, live, live...",
            artistDesc: "African Giant"
        },
        {
            id: 2,
            artist: "Salif Keita",
            song: "Manden",
            genre: "traditional",
            language: "french",
            year: "1991",
            lyrics: `Manden, terre de nos ancêtres
Ô Manden, berceau du Mali
Tes enfants se souviennent
De ta gloire et de ta splendeur

Nos pères ont combattu
Pour préserver ton honneur
Nous gardons la mémoire
De ce passé plein de valeur`,
            preview: "Manden, terre de nos ancêtres... Ô Manden, berceau du Mali...",
            artistDesc: "Golden Voice of Africa"
        },
        {
            id: 3,
            artist: "Moses Bliss",
            song: "Too Faithful",
            genre: "gospel",
            language: "english",
            year: "2020",
            lyrics: `You are too faithful to fail me
You are too faithful to fail
Jesus, you are too faithful
Too faithful to fail me

When I look back over my life
And I think things over
I can truly say that I've been blessed
I have no regrets`,
            preview: "You are too faithful to fail me... You are too faithful to fail...",
            artistDesc: "Gospel Minister"
        },
        {
            id: 4,
            artist: "Angelique Kidjo",
            song: "Agolo",
            genre: "afrobeats",
            language: "yoruba",
            year: "1994",
            lyrics: `Agolo, agolo
Gb'owo mi da'mi leru
Agolo, agolo
Se bi o ti ri ni se

[CHORUS]
Olorun mi, o seun
Olorun mi, o seun
Mo dupe, mo dupe
Mo dupe, mo dupe`,
            preview: "Agolo, agolo... Gb'owo mi da'mi leru...",
            artistDesc: "Beninese singer-songwriter"
        },
        {
            id: 5,
            artist: "Fally Ipupa",
            song: "Original",
            genre: "afrobeats",
            language: "french",
            year: "2017",
            lyrics: `[COUPLET 1]
Original, je suis original
Dans tout ce que je fais
Dans tout ce que je dis
Original, je reste original

[REFRAIN]
Je suis venu pour briller
Je suis venu pour réussir
Avec le temps qui passe
Je reste toujours moi-même`,
            preview: "Original, je suis original... Dans tout ce que je fais...",
            artistDesc: "Congolese singer"
        },
        {
            id: 6,
            artist: "Nneka",
            song: "Heartbeat",
            genre: "afrobeats",
            language: "english",
            year: "2008",
            lyrics: `My heartbeat, it beats for you
My heartbeat, it beats for two
In this world of uncertainty
Your love is my certainty

[CHORUS]
Can you feel my heartbeat?
Can you feel my heartbeat?
It's beating for you
Only for you`,
            preview: "My heartbeat, it beats for you... My heartbeat, it beats for two...",
            artistDesc: "Nigerian-German singer"
        }
    ];

    // DOM Elements
    const lyricsGrid = document.getElementById('lyricsGrid');
    const searchInput = document.getElementById('lyricsSearch');
    const searchButton = document.getElementById('lyricsSearchButton');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const emptyState = document.getElementById('emptyState');
    const loadMoreBtn = document.getElementById('loadMore');
    const lyricsModal = new bootstrap.Modal(document.getElementById('lyricsModal'));

    // Variables
    let currentFilter = 'all';
    let currentSearch = '';
    let visibleCount = 6;
    const itemsPerLoad = 6;

    // Initialize
    displayLyrics();
    setupEventListeners();
    updateCurrentYear();

    // Display lyrics based on filter and search
    function displayLyrics() {
        const filteredLyrics = filterLyrics();
        const visibleLyrics = filteredLyrics.slice(0, visibleCount);
        
        if (visibleLyrics.length === 0) {
            emptyState.style.display = 'block';
            lyricsGrid.innerHTML = '';
            loadMoreBtn.style.display = 'none';
        } else {
            emptyState.style.display = 'none';
            lyricsGrid.innerHTML = generateLyricsHTML(visibleLyrics);
            loadMoreBtn.style.display = visibleLyrics.length < filteredLyrics.length ? 'block' : 'none';
        }
    }

    // Filter lyrics based on current filter and search
    function filterLyrics() {
        return lyricsData.filter(lyric => {
            const matchesFilter = currentFilter === 'all' || 
                                 lyric.genre === currentFilter || 
                                 lyric.language === currentFilter;
            
            const matchesSearch = currentSearch === '' || 
                                 lyric.artist.toLowerCase().includes(currentSearch.toLowerCase()) ||
                                 lyric.song.toLowerCase().includes(currentSearch.toLowerCase()) ||
                                 lyric.lyrics.toLowerCase().includes(currentSearch.toLowerCase());
            
            return matchesFilter && matchesSearch;
        });
    }

    // Generate HTML for lyrics cards
    function generateLyricsHTML(lyrics) {
        return lyrics.map(lyric => `
            <div class="col-lg-4 col-md-6 mb-4">
                <div class="song-card" data-id="${lyric.id}">
                    <div class="song-header">
                        <img src="img/artists/artist${lyric.id}.jpg" alt="${lyric.artist}" class="artist-avatar">
                        <div class="artist-info">
                            <h5>${lyric.artist}</h5>
                            <small>${lyric.artistDesc}</small>
                        </div>
                        <span class="language-badge">${lyric.language.toUpperCase()}</span>
                    </div>
                    <h3 class="song-title">"${lyric.song}"</h3>
                    <p class="song-meta">
                        <i class="fas fa-calendar me-1"></i>Released: ${lyric.year}
                    </p>
                    <div class="lyrics-preview">
                        <p>${lyric.preview}</p>
                    </div>
                    <div class="song-footer">
                        <span class="genre-badge">${capitalizeFirst(lyric.genre)}</span>
                        <button class="btn btn-outline-light view-lyrics-btn" 
                                data-artist="${lyric.artist}"
                                data-song="${lyric.song}"
                                data-lyrics="${encodeLyrics(lyric.lyrics)}">
                            View Lyrics <i class="fas fa-arrow-right ms-1"></i>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Setup event listeners
    function setupEventListeners() {
        // Filter buttons
        filterButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                filterButtons.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                currentFilter = this.dataset.filter;
                visibleCount = itemsPerLoad;
                displayLyrics();
            });
        });

        // Search functionality
        searchInput.addEventListener('input', function() {
            currentSearch = this.value;
            visibleCount = itemsPerLoad;
            displayLyrics();
        });

        searchButton.addEventListener('click', function() {
            currentSearch = searchInput.value;
            visibleCount = itemsPerLoad;
            displayLyrics();
        });

        // Load more button
        loadMoreBtn.addEventListener('click', function() {
            visibleCount += itemsPerLoad;
            displayLyrics();
        });

        // View lyrics button (delegated)
        lyricsGrid.addEventListener('click', function(e) {
            if (e.target.closest('.view-lyrics-btn')) {
                const button = e.target.closest('.view-lyrics-btn');
                const artist = button.dataset.artist;
                const song = button.dataset.song;
                const lyrics = decodeLyrics(button.dataset.lyrics);
                
                showLyricsModal(artist, song, lyrics);
            }
        });

        // Copy lyrics
        document.getElementById('copyLyrics').addEventListener('click', function() {
            const lyrics = document.getElementById('modalLyricsContent').textContent;
            navigator.clipboard.writeText(lyrics)
                .then(() => alert('Lyrics copied to clipboard!'))
                .catch(err => console.error('Failed to copy:', err));
        });

        // Print lyrics
        document.getElementById('printLyrics').addEventListener('click', function() {
            window.print();
        });

        // Share lyrics
        document.getElementById('shareLyrics').addEventListener('click', function() {
            const artist = document.querySelector('.artist-name-modal').textContent;
            const song = document.querySelector('.song-title-modal').textContent;
            const url = window.location.href;
            
            if (navigator.share) {
                navigator.share({
                    title: `${song} - ${artist}`,
                    text: `Check out these lyrics on Kentescence`,
                    url: url
                });
            } else {
                navigator.clipboard.writeText(url)
                    .then(() => alert('Link copied to clipboard!'));
            }
        });
    }

    // Show lyrics modal
    function showLyricsModal(artist, song, lyrics) {
        document.querySelector('.song-title-modal').textContent = `"${song}"`;
        document.querySelector('.artist-name-modal').textContent = artist;
        document.getElementById('modalLyricsContent').textContent = lyrics;
        document.querySelector('.modal-title').textContent = `${song} - ${artist}`;
        
        lyricsModal.show();
    }

    // Helper functions
    function capitalizeFirst(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    function encodeLyrics(text) {
        return encodeURIComponent(text);
    }

    function decodeLyrics(text) {
        return decodeURIComponent(text);
    }

    function updateCurrentYear() {
        document.getElementById('currentYear').textContent = new Date().getFullYear();
    }
});