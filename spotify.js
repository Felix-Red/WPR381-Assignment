import dotenv from 'dotenv';
import fs from 'fs';
import fetch from 'node-fetch';

dotenv.config();

const CLIENT_ID = 'ce7ae7f777fa433c83d3ee099be72434';
const CLIENT_SECRET = '9a43da115238421c9557d6d063704893';
const SPOTIFY_TOKEN_URL = 'https://accounts.spotify.com/api/token';
const SPOTIFY_SEARCH_URL = 'https://api.spotify.com/v1/search';

export async function getAccessToken() {
    try {
        const response = await fetch(`${SPOTIFY_TOKEN_URL}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')
            },
            body: 'grant_type=client_credentials'
        });

        if (!response.ok) {
            throw new Error(`Failed to obtain access token: ${response.statusText}`);
        }

        const data = await response.json();
        return data.access_token;
    } catch (error) {
        console.error('Error obtaining access token:', error.message);
    }
}

export async function searchSpotify(query) {
    try {
        const accessToken = await getAccessToken();

        const response = await fetch(`${SPOTIFY_SEARCH_URL}?q=${encodeURIComponent(query)}&type=track&limit=5`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch data from Spotify: ${response.statusText}`);
        }

        const data = await response.json();

        if (data.tracks.items.length > 0) {
            data.tracks.items.forEach(track => {
                const artist = track.artists.map(artist => artist.name).join(', ');
                const song = track.name;
                const previewLink = track.preview_url;
                const album = track.album.name;

                console.log(`Artist(s): ${artist}`);
                console.log(`Song: ${song}`);
                if (previewLink) {
                    console.log(`Preview Link: ${previewLink}`);
                } else {
                    console.log(`Preview Link: No preview available.`);
                }
                console.log(`Album: ${album}`);
                console.log(); // Add an empty line between each track
            });
        } else {
            console.log('No tracks found for the given query.');
        }
    } catch (error) {
        console.error('Error fetching data from Spotify:', error.message);
    }
}

export function readQueryFromFile(filePath) {
    try {
        const query = fs.readFileSync(filePath, 'utf8').trim();
        console.log(`Executing query from file: ${query}`);
        executeCommand(query);
    } catch (err) {
        console.error('Error reading file', err);
    }
}

export function executeCommand(commandQuery) {
    const [command, ...args] = commandQuery.split(' ');
    const query = args.join(' ');

    switch (command.toLowerCase()) {
        case 'spotify':
            searchSpotify(query);
            break;
        default:
            console.log(`Unknown command: ${command}`);
            break;
    }
}