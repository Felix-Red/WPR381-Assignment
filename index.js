import { searchSpotify, readQueryFromFile } from "./spotify.js";  // Import functions from spotify.js
import readlineSync from 'readline-sync';  // Import readlineSync for synchronous command-line interaction

// Main function to display a menu and handle user input
async function main() {
    const menuOptions = [
        'Perform a Spotify look-up for a song',  // Option to search for a song on Spotify
        'Read a query from a text file',  // Option to read a search query from a file
        'Exit'  // Option to exit the program
    ];

    while (true) {
        // Display the menu and get user selection
        const index = readlineSync.keyInSelect(menuOptions, 'Choose an option:', {cancel: false});

        switch (index) {
            case 0:  // Perform a Spotify look-up for a song
                const songName = readlineSync.question('Enter the song name: ');  // Prompt user for song name
                await searchSpotify(songName);  // Await the searchSpotify function
                break;
            case 1:  // Read a query from a text file
                const filePath = readlineSync.question('Enter the file path: ');  // Prompt user for file path
                await readQueryFromFile(filePath);  // Await the readQueryFromFile function
                break;
            case 2:  // Exit the program
                console.log('Exiting...');
                return;  // Exit the loop and function
            default:  // Handle invalid selection
                console.log('Invalid option. Exiting...');
                return;  // Exit the loop and function
        }
    }
}

main();  // Call the main function to start the program
