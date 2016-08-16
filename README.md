# throwbacks
Make spotify playlists based on your last.fm scrobbles from the past

# Running

Create a file in `libs/config.js` with the content like this:

```
module.exports = {
	appKey: '<SPOTIFY_API_KEY>',
	appSecret: '<SPOTIFY_API_SECRET>',
	lastFMApiKey: '<LASTFM_API_KEY>'
}
```

Then start the app using:
```
gulp
```
And for the backend:
```
npm start
```

The app will be available on port 8888.
