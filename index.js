import { searchSpotify } from "./spotify.js";

async function main() {
    const result = await searchSpotify("drake");
    console.log(result);
}

main();