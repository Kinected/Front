"use client";
import React, {useState, useEffect} from "react"
export default function Ilevia() {
    const [nbPlacesDispo, setNbPlacesDispo] = useState(0);
    const [nbVelosDispo, setNbVelosDispo] = useState(0);
    const [nomstation, setnomstation] = useState("");
    const [codeligne, setcodeligne] = useState("");
    const [sensligne, setsensligne] = useState("");
    const [heureestimeedepart, setheureestimeedepart] = useState("")

    useEffect(() => {
        // Effectuer la requête à l'API REST pour récupérer les données de l'arrêt
        fetch('http://localhost:8000/api/ilevia/arret?userID=1', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Impossible de récupérer les données de l\'arrêt');
            }
            return response.json();
        })
        .then(data => {
            console.log(data)
            setnomstation(data);
            setcodeligne(data.codeligne);
            setsensligne(data.sensligne);
            setheureestimeedepart(data.heureestimeedepart)

        })
        .catch(error => {
            console.error('Erreur lors de la récupération des données de l\'arrêt :', error);
        });
    }, []);

    useEffect(() => {
        // Effectuer la requête à l'API REST pour récupérer les données de la borne
        fetch('http://localhost:8000/api/ilevia/borne?userID=1', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Impossible de récupérer les données de la borne');
            }
            return response.json();
        })
        .then(data => {
            setNbPlacesDispo(data.nbPlacesDispo);
            setNbVelosDispo(data.nbVelosDispo);
        })
        .catch(error => {
            console.error('Erreur lors de la récupération des données de la borne :', error);
        });
    }, []);

    return (
        <div className="text-white">
            <p>Nombre de places disponibles : {nbPlacesDispo}</p>
            <p>Nombre de vélos disponibles : {nbVelosDispo}</p>
            <p>Nom de l&apos;arrêt : {nomstation}</p>
            <p>Nom de la ligne : {codeligne}</p>
            <p>Direction: {sensligne}</p>
            <p>Heure de départ: {heureestimeedepart}</p>
        </div>
    );
}
