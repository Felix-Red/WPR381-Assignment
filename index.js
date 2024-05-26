<<<<<<< HEAD
import { searchSpotify, readQueryFromFile, executeCommand} from "./spotify.js";
import readlineSync from 'readline-sync';
=======
import { searchSpotify } from "./spotify.js";
import { readQueryFromFile} from "./spotify.js";
import { executeCommand } from "./spotify.js";

/*async function main() {
    const result = await searchSpotify("drake");
    console.log(result);
}*/

>>>>>>> d097b1f810604e3706f04c8f0a82adf2ed7538ab

async function main() {
    const menuOptions = [
        'Perform a Spotify look-up for a song',
        'Read a query from a text file',
        'Exit'
    ];

    while (true) {
        const index = readlineSync.keyInSelect(menuOptions, 'Choose an option:');

        switch (index) {
            case 0:
                const songName = readlineSync.question('Enter the song name: ');
                await searchSpotify(songName);
                break;
            case 1:
                const filePath = readlineSync.question('Enter the file path: ');
                readQueryFromFile(filePath);
                break;
            case 2:
                console.log('Exiting...');
                return;
            default:
                console.log('Invalid option. Exiting...');
                return;
        }
    }
}

main();