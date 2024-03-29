import requests
import base64

CLIENT_ID = "fb65510e89234e9dacf98b17d9588f4a"
CLIENT_SECRET = "5938a7f9eda3446db066a68036d45d23"
REDIRECT_URI = "http://localhost:3000"

def get_tokens(auth_code):
    # Encodage en base64 de l'identifiant du client et du secret du client
    client_credentials = base64.b64encode(f"{CLIENT_ID}:{CLIENT_SECRET}".encode()).decode()

    # Paramètres de la requête
    headers = {
        "Authorization": f"Basic {client_credentials}"
    }
    data = {
        "grant_type": "authorization_code",
        "code": auth_code,
        "redirect_uri": REDIRECT_URI
    }

    # Envoyer la requête
    response = requests.post("https://accounts.spotify.com/api/token", headers=headers, data=data)

    # Retourner le jeton d'accès et le jeton de rafraîchissement
    return response.json()["access_token"], response.json()["refresh_token"]



def refresh_token(refresh_token):
    # Encodage en base64 de l'identifiant du client et du secret du client
    client_credentials = base64.b64encode(f"{CLIENT_ID}:{CLIENT_SECRET}".encode()).decode()

    # Paramètres de la requête
    headers = {
        "Authorization": f"Basic {client_credentials}"
    }
    data = {
        "grant_type": "refresh_token",
        "refresh_token": refresh_token
    }

    # Envoyer la requête
    response = requests.post("https://accounts.spotify.com/api/token", headers=headers, data=data)

    # Retourner le nouveau jeton d'accès
    return response.json()["access_token"]



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




# Utiliser le code d'autorisation pour obtenir les jetons
auth_code = input("Veuillez coller le code d'autorisation ici : ")
access_token, refresh_token = get_tokens(auth_code)
# Utiliser le nouveau jeton d'accès pour obtenir les données du lecteur
access_token = refresh_token(refresh_token)
getplayer(access_token)