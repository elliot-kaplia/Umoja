"use client";
import React, { useEffect, useState } from "react";
import { apiGet } from "@/app/services/externalApiClients";
import { Card, Label, TextInput, Select, Button, Checkbox, FileInput } from "flowbite-react";
import { FiRefreshCw } from "react-icons/fi";
import { apiPostSFTP } from "@/app/services/internalApiClients";

interface ConditionsFinancieresFormProps {
    conditionsFinancieres: {
        conditionsFinancieresParPDF: boolean | null;
        minimunGaranti: number | null;
        conditionsPaiement: string | null;
        pourcentageRecette: number | null;
    };
    idProjet: string;
    onConditionsFinancieresChange: (name: string, value: string | boolean) => void;
}

const ConditionsFinancieresForm: React.FC<ConditionsFinancieresFormProps> = ({
    conditionsFinancieres,
    onConditionsFinancieresChange,
    idProjet,
}) => {
    const [offreId, setOffreId] = useState<string>(idProjet);
    const [file, setFile] = useState<File | null>(null);
    const [message, setMessage] = useState('');
    const [colorMessage, setColorMessage] = useState('success');
    const [isTextInputActive, setIsTextInputActive] = useState(true);

    const handleConditionsFinancieresChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target as HTMLInputElement;
        const newValue = type === "checkbox" ? !conditionsFinancieres.conditionsFinancieresParPDF : value;
        
        onConditionsFinancieresChange(name, newValue);
        if (name === 'conditionsFinancieresParPDF') {
            setIsTextInputActive(!isTextInputActive);
        }
    };

    const handleReset = () => {
        onConditionsFinancieresChange("minimunGaranti", "");
        onConditionsFinancieresChange("conditionsPaiement", "");
        onConditionsFinancieresChange("pourcentageRecette", "");
    };

    const [conditionsPaiement, setConditionsPaiement] = useState<string[]>([]);

    useEffect(() => {
        const fetchMonnaieExistantes = async () => {
            try {
                const data: { currencies: Record<string, unknown> }[] = await apiGet("https://restcountries.com/v3.1/all");
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

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        setFile(e.target.files?.[0] || null);
    };

    useEffect(() => {
            setOffreId(idProjet);
        }, [idProjet]);
    
    useEffect(() => {
        if (offreId && file) {
            const handleSubmit = async () => {
    
                const formData = new FormData();
                formData.append('file', file);
                formData.append('idProjet', offreId.toString());
                formData.append('typeFichier', "conditions_financieres");
    
                try {
                    await apiPostSFTP('/upload-sftp-fichier', formData);
                    setColorMessage('text-green-500');
                    setMessage('Le fichier a été transféré avec succès');
                } catch (error) {
                    console.error('Erreur lors du transfert du fichier :', error);
                    setColorMessage('text-red-500');
                    setMessage('Erreur lors du transfert du fichier, veuillez réessayer');
                }
            };
    
            handleSubmit();
        }
    }, [offreId, file]);

    return (
        <Card className="shadow-none border-none mx-auto w-full">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-semibold">Conditions financières</h3>
                <Button
                    color="gray"
                    onClick={handleReset}
                    pill
                    aria-label="Reset"
                    className="flex items-center"
                >
                    <FiRefreshCw className="w-4 h-4" />
                </Button>
            </div>

            <div className="mb-4">
                <Checkbox
                    id="toggleInputType"
                    checked={isTextInputActive}
                    onChange={handleConditionsFinancieresChange}
                    name="conditionsFinancieresParPDF"
                />
                <Label htmlFor="toggleInputType" className="ml-2">
                    Ne pas importer de PDF
                </Label>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-5">
                <div>
                    <Label htmlFor="minimunGaranti" value="Minimum garanti récolté à la fin de l'évènement:" />
                    <TextInput
                        disabled={!isTextInputActive}
                        type="number"
                        id="minimunGaranti"
                        name="minimunGaranti"
                        value={conditionsFinancieres.minimunGaranti ?? ""}
                        onChange={handleConditionsFinancieresChange}
                        required
                        placeholder="1500... (en €)"
                        className="mt-1"
                    />
                </div>

                <div>
                    <Label htmlFor="conditionsPaiement" value="Conditions de paiement des participants:" />
                    <Select
                        disabled={!isTextInputActive}
                        id="conditionsPaiement"
                        name="conditionsPaiement"
                        value={conditionsFinancieres.conditionsPaiement ?? ""}
                        onChange={handleConditionsFinancieresChange}
                        required
                        className="mt-1"
                    >
                        <option value="">Sélectionnez une monnaie</option>
                        {conditionsPaiement.map((monnaie, index) => (
                            <option key={index} value={monnaie}>
                                {monnaie}
                            </option>
                        ))}
                    </Select>
                </div>
            </div>

            <div className="mb-5">
                <Label htmlFor="pourcentageRecette" value="Pourcentage sur les recette de billetterie:" />
                <TextInput
                    disabled={!isTextInputActive}
                    type="number"
                    step={0.01}
                    id="pourcentageRecette"
                    name="pourcentageRecette"
                    value={conditionsFinancieres.pourcentageRecette ?? ""}
                    onChange={handleConditionsFinancieresChange}
                    required
                    placeholder="10.0... (en %)"
                    className="mt-1"
                />
            </div>

            <div className="flex">
                <FileInput
                    disabled={isTextInputActive}
                    className="w-full mr-5"
                    accept="application/pdf"
                    onChange={handleFileChange}
                />
            </div>

            {message && <p className={colorMessage}>{message}</p>}
        </Card>
    );
};

export default ConditionsFinancieresForm;
