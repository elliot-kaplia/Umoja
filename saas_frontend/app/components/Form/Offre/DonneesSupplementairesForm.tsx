"use client";
import React, { useEffect, useState } from 'react';
import FicheTechniqueArtisteForm from '@/app/components/Form/Offre/FicheTechniqueArtiste';
import { apiGet, apiGetWithData, apiPost } from '@/app/services/apiClients';

interface DonneesSupplementairesFormProps {
    donneesSupplementaires: {
        ficheTechniqueArtiste: {
            besoinBackline: string;
            besoinEclairage: string;
            besoinEquipements: string;
            besoinScene: string;
            besoinSonorisation: string
        },
        reseau: string[];
        nbReseaux: number;
        genreMusical: string[];
        nbGenresMusicaux: number;
        artiste: string;
    };
    onDonneesSupplementairesChange: (name: string, value: any) => void;
    onFicheTechniqueChange: (name: string, value: string) => void;
}

const DonneesSupplementairesForm: React.FC<DonneesSupplementairesFormProps> = ({
    donneesSupplementaires,
    onDonneesSupplementairesChange,
    onFicheTechniqueChange
}) => {
    const handleDonneesSupplementairesChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        onDonneesSupplementairesChange(name, value);
    };

    const [genresMusicaux, setGenresMusicaux] = useState<Array<{ nomGenreMusical: string }>>([]);
    const [selectedGenres, setSelectedGenres] = useState<string[]>(donneesSupplementaires.genreMusical);

    const [reseaux, setReseaux] = useState<Array<any>>([]);
    const [selectedReseaux, setSelectedReseaux] = useState<string[]>(donneesSupplementaires.reseau);

    useEffect(() => {
        const fetchGenresMusicaux = async () => {
            try {
                const genres = await apiGet('/genres-musicaux');
                const genresList = JSON.parse(genres.genres_musicaux);
                setGenresMusicaux(genresList);
            } catch (error) {
                console.error("Erreur lors du chargement des genres musicaux :", error);
            }
        };
        const fetchReseauUtilisateur = async () => {
            try {
                const data = {username: 'username n° 1'};
                const datasUser = await apiPost('/utilisateur', JSON.parse(JSON.stringify(data)));
                const reseauxListe: Array<any> = JSON.parse(datasUser.utilisateur)[0].membreDesReseaux;
                setReseaux(reseauxListe);
                console.log(reseauxListe);
            } catch (error) {
                console.error("Erreur lors du chargement des données utilisateurs :", error);
            }
        };
        fetchGenresMusicaux();
        fetchReseauUtilisateur();
    }, []);

    const handleGenreSelectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);

        if (selectedOptions.length <= genresMusicaux.length) {
            setSelectedGenres(selectedOptions);
            onDonneesSupplementairesChange('genreMusical', selectedOptions);
            onDonneesSupplementairesChange('nbGenresMusicaux', selectedOptions.length);
        } else {
            alert(`Vous pouvez sélectionner un maximum de ${genresMusicaux.length} genres.`);
        }
    };

    const handleReseauxSelectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);

        if (selectedOptions.length <= reseaux.length) {
            setSelectedReseaux(selectedOptions);
            onDonneesSupplementairesChange('reseau', selectedOptions);
            onDonneesSupplementairesChange('nbReseaux', selectedOptions.length);
        } else {
            alert(`Vous pouvez sélectionner un maximum de ${reseaux.length} genres.`);
        }
    };

    return (
        <div className="mx-auto w-full max-w bg-white rounded-lg shadow-md p-8">
            <div>
                <FicheTechniqueArtisteForm
                    ficheTechniqueArtiste={donneesSupplementaires.ficheTechniqueArtiste}
                    onFicheTechniqueChange={onFicheTechniqueChange}
                />
            </div>
            <div className="flex flex-col rounded-lg mb-4">
                <div className="mb-5">
                    <h3 className="text-2xl font-semibold text-[#07074D] mb-4">Artiste Concerné</h3>
                    <div className="flex flex-col">
                        <label htmlFor="artiste" className="text-gray-700">Artiste:</label>
                        <input
                            type="text"
                            id="artiste"
                            name="artiste"
                            value={donneesSupplementaires.artiste}
                            onChange={handleDonneesSupplementairesChange}
                            required
                            placeholder="L'artiste concerné par l'offre"
                            className="w-full mt-1 rounded-md border border-[#e0e0e0] bg-white py-2 px-3 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                        />
                    </div>
                </div>

                <h3 className="text-2xl font-semibold text-[#07074D] mb-4">Réseau et Genre Musical</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col">
                        <label htmlFor="reseau" className="text-gray-700">Réseau:</label>
                        <select
                            id="reseau"
                            name="reseau"
                            value={selectedReseaux}
                            onChange={handleReseauxSelectionChange}
                            required
                            multiple
                            className="w-full mt-1 rounded-md border border-[#e0e0e0] bg-white py-2 px-3 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                        >
                            {reseaux.map((reseau, index) => (
                                <option key={index} value={reseau.idReseau.nomReseau}>
                                    {reseau.idReseau.nomReseau}
                                </option>
                            ))}
                        </select>
                        <p className="text-sm text-gray-500 mt-1">
                            Vous pouvez sélectionner jusqu'à {reseaux.length} réseaux.
                        </p>
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="genreMusical" className="text-gray-700">Genre Musical:</label>
                        <select
                            id="genreMusical"
                            name="genreMusical"
                            value={selectedGenres}
                            onChange={handleGenreSelectionChange}
                            multiple
                            className="w-full mt-1 rounded-md border border-[#e0e0e0] bg-white py-2 px-3 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                        >
                            {genresMusicaux.map((genre, index) => (
                                <option key={index} value={genre.nomGenreMusical}>
                                    {genre.nomGenreMusical}
                                </option>
                            ))}
                        </select>
                        <p className="text-sm text-gray-500 mt-1">
                            Vous pouvez sélectionner jusqu'à {genresMusicaux.length} genres.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DonneesSupplementairesForm;
