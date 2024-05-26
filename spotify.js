import dotenv from 'dotenv';  // Import dotenv to load environment variables from a .env file
import fs from 'fs';  // Import filesystem module to read files
import fetch from 'node-fetch';  // Import node-fetch to make HTTP requests

dotenv.config();  // Load environment variables from .env file

const CLIENT_ID = process.env.CLIENT_ID;  // Spotify Client ID from environment variable
const CLIENT_SECRET = process.env.CLIENT_SECRET;  // Spotify Client Secret from environment variable
const SPOTIFY_TOKEN_URL = 'https://accounts.spotify.com/api/token';  // URL to get Spotify access token
const SPOTIFY_SEARCH_URL = 'https://api.spotify.com/v1/search';  // URL to search Spotify's API

// Function to get Spotify access token
export async function getAccessToken() {
    try {
        const response = await fetch(`${SPOTIFY_TOKEN_URL}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',  // Set the request headers
                'Authorization': 'Basic ' + Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')  // Basic auth with Base64 encoding
            },
            body: 'grant_type=client_credentials'  // Request body for client credentials grant type
        });

        // Check if the response is not OK
        if (!response.ok) {
            throw new Error(`Failed to obtain access token: ${response.statusText}`);
        }

        const data = await response.json();  // Parse the response JSON
        return data.access_token;  // Return the access token
    } catch (error) {
        console.error('Error obtaining access token:', error.message);  // Log any errors
    }
}

// Function to search Spotify with a given query
export async function searchSpotify(query) {
    try {
        const accessToken = await getAccessToken();  // Get the access token

        const response = await fetch(`${SPOTIFY_SEARCH_URL}?q=${encodeURIComponent(query)}&type=track&limit=5`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`  // Set the Authorization header with Bearer token
            }
        });

        // Check if the response is not OK
        if (!response.ok) {
            throw new Error(`Failed to fetch data from Spotify: ${response.statusText}`);
        }

        const data = await response.json();  // Parse the response JSON

        // Check if there are any tracks in the response
        if (data.tracks.items.length > 0) {
            data.tracks.items.forEach(track => {
                // Extract track details
                const artist = track.artists.map(artist => artist.name).join(', ');
                const song = track.name;
                const previewLink = track.preview_url;
                const album = track.album.name;
                // Log track details
                console.log(`Artist(s): ${artist}`);
                console.log(`Song: ${song}`);
                //check if there is a preview link
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
        console.error('Error fetching data from Spotify:', error.message);  // Log any errors
    }
}

// Function to execute a command based on a command query
async function executeCommand(commandQuery) {
    // console.log(`Command received: ${commandQuery}`);  // Log the received command
    const [command, ...args] = commandQuery.split(' ');  // Split the command and its arguments
    const query = args.join(' ');  // Join the arguments to form the query

    switch (command.toLowerCase()) {  // Convert command to lowercase and switch
        case 'spotify':
            await searchSpotify(query);  // Call searchSpotify with the query
            break;
        default:
            console.log(`Unknown command: ${command}`);  // Handle unknown command
            break;
    }
}

// Function to read a query from a file and execute it
export async function readQueryFromFile(filePath) {
    try {
        console.log(`Attempting to read file: ${filePath}`);  // Log the file path
        const query = fs.readFileSync(filePath, 'utf8').trim();  // Read and trim the file content
        console.log(`File content: ${query}`);  // Log the file content
        if (query) {
            const commandQuery = `spotify ${query}`;  // Prepend 'spotify' command to the query
            // console.log(`Executing query from file: ${commandQuery}`);
            await executeCommand(commandQuery);  // Await the async function executeCommand
        } else {
            console.log('No query found in file.');
        }
    } catch (err) {
        console.error('Error reading file', err);  // Log any errors
    }
}
