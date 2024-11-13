"use client";
import React from 'react';
import {Label, TextInput, Textarea, Card } from 'flowbite-react';

interface ExtrasFormProps {
    extras: {
        descrExtras: string | null;
        coutExtras: number | null;
        exclusivite: string | null;
        exception: string | null;
        ordrePassage: string | null;
        clausesConfidentialites: string | null;
    };
    onExtrasChange: (name: string, value: string) => void;
}

const ExtrasForm: React.FC<ExtrasFormProps> = ({
    extras,
    onExtrasChange,
}) => {
    const handleExtrasChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        onExtrasChange(name, value);
    };
        return (
            <Card className="shadow-none border-none mx-auto w-full">
                <h3 className="text-2xl font-semibold mb-4">Extras de l&apos;offre</h3>

                {/* Section description et coût */}
                <div className="grid grid-cols-2 gap-4 mb-5">
                    <div>
                        <Label htmlFor="descrExtras" value="Description de l'extras" />
                        <TextInput
                            id="descrExtras"
                            name="descrExtras"
                            type="text"
                            value={extras.descrExtras || undefined}
                            onChange={handleExtrasChange}
                            placeholder="Description des Extras"
                        />
                    </div>
                    <div>
                        <Label htmlFor="coutExtras" value="Coût des extras" />
                        <TextInput
                            id="coutExtras"
                            name="coutExtras"
                            type="number"
                            value={extras.coutExtras || undefined}
                            onChange={handleExtrasChange}
                            placeholder="Coût des Extras"
                        />
                    </div>
                </div>

                {/* Section exclusivité et exception */}
                <div className="grid grid-cols-2 gap-4 mb-5">
                    <div>
                        <Label htmlFor="exclusivite" value="Exclusivité proposée" />
                        <TextInput
                            id="exclusivite"
                            name="exclusivite"
                            type="text"
                            value={extras.exclusivite || undefined}
                            onChange={handleExtrasChange}
                            placeholder="Exclusivité"
                        />
                    </div>
                    <div>
                        <Label htmlFor="exception" value="Exception de l'extras" />
                        <TextInput
                            id="exception"
                            name="exception"
                            type="text"
                            value={extras.exception || undefined}
                            onChange={handleExtrasChange}
                            placeholder="Exceptions"
                        />
                    </div>
                </div>

                {/* Section ordre de passage et clauses de confidentialité */}
                <div className="grid gap-4 mb-5">
                    <div>
                        <Label htmlFor="ordrePassage" value="Ordre de passage" />
                        <TextInput
                            id="ordrePassage"
                            name="ordrePassage"
                            type="text"
                            value={extras.ordrePassage || undefined}
                            onChange={handleExtrasChange}
                            placeholder="Ordre de Passage"
                            className='w-full'
                        />
                    </div>
                </div>
                <div>
                    <Label htmlFor="clausesConfidentialites" value="Clauses de confidentialité" />
                    <Textarea
                        id="clausesConfidentialites"
                        name="clausesConfidentialites"
                        value={extras.clausesConfidentialites || undefined}
                        onChange={handleExtrasChange}
                        placeholder="Clauses de Confidentialité"
                        className='w-full'
                    />
                </div>

                {/* Bouton de suppression */}
                {/* <Button color="failure" onClick={() => onRemove(0)} pill className="mt-2">
                    Supprimer Extras
                </Button> */}
            </Card>
        );    
};

export default ExtrasForm;
