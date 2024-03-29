import webbrowser

CLIENT_ID = "fb65510e89234e9dacf98b17d9588f4a"
REDIRECT_URI = "http://localhost:3000"
SCOPES = "user-read-currently-playing"  # Les scopes déterminent quelles actions votre application est autorisée à effectuer

auth_url = "https://accounts.spotify.com/authorize"
auth_params = {
    "client_id": CLIENT_ID,
    "response_type": "code",
    "redirect_uri": REDIRECT_URI,
    "scope": SCOPES,
}

# Construire l'URL d'autorisation et ouvrir la page dans le navigateur
auth_url_with_params = f"{auth_url}?{'&'.join(f'{key}={value}' for key, value in auth_params.items())}"
webbrowser.open(auth_url_with_params)