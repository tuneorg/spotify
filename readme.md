# Installation
> npm install @tuneorg/spotify

# Basic Implementation

```ts
import { Spotify } from "@tuneorg/spotify";

const spotify = new Spotify({
   clientId: "",
   clientSecret: "",
   cacheResults: true,
   cacheLifetime: 30 * 60 * 1000, //default is 30 minutes
});
(async () => {
 await spotify.renewToken(); //must be invoked first
 const search = await spotfiy.search(url);
 console.log(search);
})();
```