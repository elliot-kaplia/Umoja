"use client";
import React, { useEffect, useState } from 'react';
import { apiGet } from '@/app/services/externalApiClients';

interface ConditionsFinancieresFormProps {
    conditionsFinancieres: {
        minimumGaranti: number;
        conditionsPaiement: string;
        pourcentageRecette: number;
    };
    onConditionsFinancieresChange: (name: string, value: string) => void;
}

const ConditionsFinancieresForm: React.FC<ConditionsFinancieresFormProps> = ({
    conditionsFinancieres,
    onConditionsFinancieresChange,
}) => {
    const handleConditionsFinancieresChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        onConditionsFinancieresChange(name, value);
    };

    const [conditionsPaiement, setConditionsPaiement] = useState<string[]>([]);

    useEffect(() => {
        const fetchMonnaieExistantes = async () => {
            try {
                const data: { currencies: Record<string, unknown> }[] = await apiGet('https://restcountries.com/v3.1/all');
                const monnaieList = Array.from(
                    new Set(data.flatMap((country) => Object.keys(country.currencies || {})))
                );
                setConditionsPaiement(monnaieList);
            } catch (error) {
                console.error("Erreur lors de la récupération des monnaies existantes :", error);
            }
        };

        fetchMonnaieExistantes();
    }, []);

    return (
        <div className="flex items-center justify-center">
            <div className="mx-auto w-full max-w bg-gray-800 rounded-lg p-8">
                <h3 className="text-2xl font-semibold text-white mb-4">Conditions financières</h3>
                
                <div className="grid grid-cols-2 gap-4 mb-5">
                    <div>
                        <label htmlFor="minimumGaranti" className="text-white">Minimum Garanti:</label>
                        <input
                            type="number"
                            id="minimumGaranti"
                            name="minimumGaranti"
                            value={conditionsFinancieres.minimumGaranti || 0}
                            onChange={handleConditionsFinancieresChange}
                            required
                            placeholder="Minimum garanti"
                            className="w-full mt-1 rounded-md border border-grey-700 bg-gray-900 py-2 px-3 text-base font-medium text-white outline-none focus:border-[#6A64F1] focus:shadow-md"
                        />
                    </div>

                    <div>
                        <label htmlFor="conditionsPaiement" className="text-white">Conditions de Paiement:</label>
                        <select
                            id="conditionsPaiement"
                            name="conditionsPaiement"
                            value={conditionsFinancieres.conditionsPaiement}
                            onChange={handleConditionsFinancieresChange}
                            required
                            className="w-full mt-1 rounded-md border border-grey-700 bg-gray-900 py-2 px-3 text-base font-medium text-white outline-none focus:border-[#6A64F1] focus:shadow-md"
                        >
                            <option value="">Sélectionnez une monnaie</option>
                            {conditionsPaiement.map((monnaie, index) => (
                                <option key={index} value={monnaie}>
                                    {monnaie}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="mb-5">
                    <label htmlFor="pourcentageRecette" className="text-white">Pourcentage de Recette:</label>
                    <input
                        type="number"
                        id="pourcentageRecette"
                        name="pourcentageRecette"
                        value={conditionsFinancieres.pourcentageRecette || 0.0}
                        onChange={handleConditionsFinancieresChange}
                        required
                        placeholder="15.5%" 
                        className="w-full mt-1 rounded-md border border-grey-700 bg-gray-900 py-2 px-3 text-base font-medium text-white outline-none focus:border-[#6A64F1] focus:shadow-md"
                    />
                </div>
            </div>
        </div>
    );
};

export default ConditionsFinancieresForm;
