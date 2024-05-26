import { searchSpotify } from "./spotify.js";
import { readQueryFromFile} from "./spotify.js";
import { executeCommand } from "./spotify.js";

/*async function main() {
    const result = await searchSpotify("drake");
    console.log(result);
}
*/

async function main() {
    console.log('---START PAGE---');
    console.log('Welcome to a Spotify API search');
    //console.log('Group K2');
    console.log(); //Add empty line between options and text

    //have menu options
    const menuOptions = [
        'Perform a Spotify look-up for a song',
        'Read a query from a text file',
        'Group members'
    ];

    //read input
    const index = readlineSync.keyInSelect(menuOptions, 'Choose an option:');

    switch (index) {
        case 0:
            const songSpotify = readlineSync.question('Enter the search: ');
            await searchSpotify(songSpotify);
            break;
        case 1:
            const filePath = readlineSync.question('Enter the file path: ');
            readQueryFromFile(filePath);
            break;
        case 2:
            console.log('577585 Carli Theron');
            console.log('577502 Chay Wilson');
            console.log('577922 Felix Mandyme');
            console.log('576509 Kyle Tarran');
            console.log('577305 Sarelda Nel');
            break;
        default:
            console.log('Exiting...');
            readlineSync.close(); //close terminal stream
            break;
    }
}

main();