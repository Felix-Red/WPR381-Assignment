import dotenv from 'dotenv';
import readlineSync from 'readline-sync';

//configure .env file so we dont expose the client id and client secret
dotenv.config();
//set the constants for the keys and endpoints we need to hit 
const CLIENT_ID = 'ce7ae7f777fa433c83d3ee099be72434';
const CLIENT_SECRET = '9a43da115238421c9557d6d063704893';
const SPOTIFY_TOKEN_URL = 'https://accounts.spotify.com/api/token';
const SPOTIFY_SEARCH_URL = 'https://api.spotify.com/v1/search';

//function needed to get an access token
async function getAccessToken() {
    try {
        //formulating response to hit the endpoint to obtain a token
        const response = await fetch(`${SPOTIFY_TOKEN_URL}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')
            },
            body: 'grant_type=client_credentials'
        });

        //if there is an error with obtaining the response then throw new error
        if (!response.ok) {
            throw new Error(`Failed to obtain access token: ${response.statusText}`);
        }

        //need to convert the data sent back to json
        const data = await response.json();
        //only return the access token so we can search in the next function
        return data.access_token;
    } catch (error) {
        console.error('Error obtaining access token:', error.message);
    }
}

// Function to fetch data from the Spotify API
export async function searchSpotify(query) {
    try {

        //calling the function created to obtain an accesstoken to search spotify
        const accessToken = await getAccessToken();

        //formulating response with the endpoints and relevant authorization
        const response = await fetch(`${SPOTIFY_SEARCH_URL}?q=${encodeURIComponent(query)}&type=track&limit=5`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        //throw error if the response is not able to be met
        if (!response.ok) {
            throw new Error(`Failed to fetch data from Spotify: ${response.statusText}`);
        }
        //convert the data retreived into json 
        const data = await response.json();

        // Process the response and check if the lenghth of tracks is greater than 0 to ensure it exists
        if (data.tracks.items.length > 0) {
            // Loop through each track and format the data
            data.tracks.items.forEach(track => {
                const artist = track.artists.map(artist => artist.name).join(', ');
                const song = track.name;
                const previewLink = track.preview_url;
                const album = track.album.name;

                console.log(`Artist(s): ${artist}`);
                console.log(`Song: ${song}`);
                //error handling if song does not have a preview link
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



//Example usage
const query = readlineSync.question('Enter the name of the artist: ');
if (query) {
    searchSpotify(query);
} else {
    console.log('Please provide a search query.');
}



