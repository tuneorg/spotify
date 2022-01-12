# Basic Implementation

```ts
import { Spotify } from "@tunebot/spotify";

const spotify = new Spotify({
   clientId: "",
   clientSecret: ""
});
(async () => {
 const search = await spotfiy.search(url);
 console.log(search);
})();
```