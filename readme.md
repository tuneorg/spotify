# Installation
> npm install @tuneorg/spotify

# Basic Implementation

```ts
import { Spotify } from "@tuneorg/spotify";

const spotify = new Spotify({
   clientId: "",
   clientSecret: ""
});
(async () => {
 const search = await spotfiy.search(url);
 console.log(search);
})();
```