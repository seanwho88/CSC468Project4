import spotipy
from spotipy.oauth2 import SpotifyOAuth
from spotipy.oauth2 import SpotifyClientCredentials
import os
scope = "user-library-read"
appClientID = "173cb4444d10480fa0227df5c5cc6347"
appClientSecret = "62460100e2814434a7307641dda753f1"
appRedirect = "https://localhost:8080/callback"

ccm = SpotifyClientCredentials(client_id = appClientID, client_secret = appClientSecret)
sp = spotipy.Spotify(client_credentials_manager = ccm)

os.environ["SPOTIPY_CLIENT_ID"] = appClientID
os.environ["SPOTIPY_CLIENT_SECRET"] = appClientSecret
os.environ["SPOTIPY_REDIRECT_URI"] = appRedirect

scope = 'user-library-read'
scope2 = 'user-read-currently-playing'

#username = "davidrockwell7310"

sp = spotipy.Spotify(auth_manager=SpotifyOAuth(client_id=appClientID,
                                               client_secret=appClientSecret,
                                               redirect_uri=appRedirect,
                                               scope=scope2))

results = sp.currently_playing()
print(results)

###results = sp.current_user_saved_tracks()
for idx, item in enumerate(results['items']):
    track = item['track']
    print(idx, track['artists'][0]['name'], " – ", track['name'])###
