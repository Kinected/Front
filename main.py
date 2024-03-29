import requests

CLIENT_ID = "fb65510e89234e9dacf98b17d9588f4a"
CLIENT_SECRET = "5938a7f9eda3446db066a68036d45d23"
REDIRECT_URI = "http://localhost:3000"

CODE = "AQCIYqOChRt_1228N3EZstrq8hFC-D6HIgy7h6EpzhkWmrIAtsQVpbY_h3guC-MzXNB14U0cfPTZHEYX66HmWigmGPgDQo77jGGHAmXIt3C-5sjsbm69Xss4OsQ6zdr7K9ecHoOVpXSec_1cf7NKKcI6GNCJtnSmf4AY7-302I7t4FZSvGuqPDPvmzXpD9JDns2hQZ5J"





def getplayer(access_token):
     # Envoyer une requête à l'API
    headers = {
        "Authorization": f"Bearer {access_token}"
    }
    url = "https://api.spotify.com/v1/me/player/currently-playing"
    response = requests.get(url, headers=headers)

    if response.status_code == 200:
        # Analyser la réponse
        data = response.json()
        if data["is_playing"]:
            artist = data["item"]["artists"][0]["name"]
            track = data["item"]["name"]
            print(f"En cours de lecture : {artist} - {track}")
        else:
            print("Aucune musique en cours de lecture")
    else:
        print(f"Erreur lors de l'obtention des données du lecteur : {response.status_code}")



# Échanger le code d'autorisation contre un jeton d'accès
auth_url = "https://accounts.spotify.com/api/token"
auth_data = {
    "grant_type": "authorization_code",
    "code": CODE,
    "redirect_uri": REDIRECT_URI,
    "client_id": CLIENT_ID,
    "client_secret": CLIENT_SECRET,
}
response = requests.post(auth_url, data=auth_data)
response_data = response.json()

if response.status_code == 200:
    access_token = response_data["access_token"]
    refresh_token = response_data["refresh_token"]
    print(access_token)
    print(refresh_token)
    getplayer(access_token)

    
else:
    print(f"Erreur lors de l'obtention du token d'accès : {response_data}")


   