"use client";
import React, { useEffect, useState } from 'react';
import FicheTechniqueArtisteForm from '@/app/components/Form/Offre/FicheTechniqueArtiste';
import { apiGet } from '@/app/services/apiClients';

interface DonneesSupplementairesFormProps {
    donneesSupplementaires: {
        ficheTechniqueArtiste: {
            besoinBackline: string;
            besoinEclairage: string;
            besoinEquipements: string;
            besoinScene: string;
            besoinSonorisation: string
        },
        reseau: string;
        genreMusical: string;
        artiste: string;
    };
    onDonneesSupplementairesChange: (name: string, value: string) => void;
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
        fetchGenresMusicaux();
    }, []);

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
                        <input
                            type="text"
                            id="reseau"
                            name="reseau"
                            value={donneesSupplementaires.reseau}
                            onChange={handleDonneesSupplementairesChange}
                            required
                            placeholder="Les réseaux sur lesquels vous posterez votre offre"
                            className="w-full mt-1 rounded-md border border-[#e0e0e0] bg-white py-2 px-3 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="genreMusical" className="text-gray-700">Genre Musical:</label>
                        <select
                            id="genreMusical"
                            name="genreMusical"
                            value={donneesSupplementaires.genreMusical}
                            onChange={handleDonneesSupplementairesChange}
                            required
                            className="w-full mt-1 rounded-md border border-[#e0e0e0] bg-white py-2 px-3 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                        >
                            <option value="" disabled>Choisir un genre musical</option>
                            {genresMusicaux.map((genre, index) => (
                                <option key={index} value={genre.nomGenreMusical}>
                                    {genre.nomGenreMusical}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DonneesSupplementairesForm;
