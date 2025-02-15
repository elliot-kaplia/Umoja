"use client"

import React, { Suspense, useState, useEffect, useCallback } from 'react';
import { FaLink } from "react-icons/fa";
import { HiCheck } from 'react-icons/hi';
import { useSearchParams } from 'next/navigation';
// import { FaFacebookF, FaTwitter, FaLinkedinIn } from 'react-icons/fa';
import { Progress, Button, Modal, Card, Spinner, Textarea, Avatar, Tabs, Toast } from 'flowbite-react';
import NumberInputModal from '../../app/components/ui/modalResponse';
import { apiGet, apiPost, apiDelete, apiPatch } from '../../app/services/internalApiClients';
import NavigationHandler from '../../app/navigation/Router';
import CommentaireSection from "../../app/components/Commentaires/CommentaireSection";
import Image from 'next/image';
import { FicheTechniqueArtiste, FormData } from '../../app/types/FormDataType';
import ModifierOffreForm from '../../app/components/ui/modifierOffre';
import DownloadButton from '../../app/components/DowloadFilePDF';

interface Extras {
    extrasParPDF: boolean;
    id: number;
    descrExtras: string;
    coutExtras: number;
    exclusivite: string;
    exception: string;
    ordrePassage: string;
    clausesConfidentialites: string;
}

interface Reseau {
    nomReseau: string;
}

interface GenreMusical {
    nomGenreMusical: string;
}

interface Artiste {
    nomArtiste: string;
}
  
interface EtatOffre {
    id: number;
    nomEtat: string;
}

interface ConditionsFinancieres {
    conditionsFinancieresParPDF: boolean;
    id: number;
    minimunGaranti: number;
    conditionsPaiement: string;
    pourcentageRecette: number;
}

interface BudgetEstimatif {
    budgetEstimatifParPDF: boolean;
    id: number;
    cachetArtiste: number;
    fraisDeplacement: number;
    fraisHebergement: number;
    fraisRestauration: number;
}

interface TypeOffre {
    nomTypeOffre: string;
};

interface Utilisateur {
    username: string;
};
interface Project {
    id: number;
    titleOffre: string;
    descrTournee: string;
    commenteesPar: { id: number }[];
    dateMaxProposee: string;
    dateMinProposee: string;
    deadLine: string;
    etatOffre: EtatOffre;
    extras: Extras;
    image: string | null;
    liensPromotionnels: string;
    nbArtistesConcernes: number;
    nbInvitesConcernes: number;
    placesMax: number;
    placesMin: number;
    regionVisee: string;
    villeVisee: string;
    utilisateur: Utilisateur;
    typeOffre: TypeOffre;
    budgetEstimatif: BudgetEstimatif;
    conditionsFinancieres: ConditionsFinancieres;
    ficheTechniqueArtiste: FicheTechniqueArtiste;
    reseaux: Reseau[];
    genresMusicaux: GenreMusical[];
    artistes: Artiste[];
};

interface BudgetEstimatif {
    id: number;
    cachetArtiste: number;
    fraisDeplacement: number;
    fraisHebergement: number;
    fraisRestauration: number;
}

interface Commentaire {
    id: number;
    utilisateur : {
        username : string;
    }
    commentaire: string;
}

interface Reponse {
    id: number;
    etatReponse : {nomEtatReponse : string};
    offreId: number;
    utilisateurId: number;
    utilisateur: {
        username: string;
    };
    dateDebut: string;
    dateFin: string;
    prixParticipation: number;
}

interface TimeLeft {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

async function fetchCommentaire(idCommenaire: number): Promise<Commentaire[]> {
    const response = await apiGet(`/commentaire/${idCommenaire}`);
    if (!response) {
      throw new Error("Erreur lors de la récupération du commentaire");
    }
    return JSON.parse(response.commentaires);
}

function ProjectDetailsContent() {
    const [commentaires, setCommentaires] = useState<Commentaire[]>([]);
    const [budgetTotal, setBudgetTotal] = useState<number>(0);
    const [reponsesValidees, setReponsesValidees] = useState<Reponse[]>([]);
    const [budgetTotalReponsesRecu, setBudgetTotalReponsesRecu] = useState<number>(0);
    const [pourcentageBudgetRecu, setPourcentageBudgetRecu] = useState<number>(0);
    const [nbContributions, setNbContributions] = useState<number>(0);
    const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null);
    const [loading, setLoading] = useState(false);
    const [commentaire, setCommentaire] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [username, setUsername] = useState<string>("");
    const searchParams = useSearchParams();
    const id = Number(searchParams.get('id'));
    const [project, setProject] = useState<Project>();
    // const project = projects.find(p => p.id === Number(id));
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<number>(1);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showModifyOffre, setShowModifyOffre] = useState(false);
    const [formData, setFormData] = useState<FormData>({} as FormData);
    const [liensPromotionnelsList, setLiensPromotionnelsList] = useState<string[]>([]);

    const [extrasParPDF, setExtrasParPDF] = useState<boolean | null>(null);
    const [budgetEstimatifParPDF, setBudgetEstimatifParPDF] = useState<boolean | null>(null);
    const [conditionsFinancieresParPDF, setConditionsFinancieresParPDF] = useState<boolean | null>(null);
    const [ficheTechniqueArtisteParPDF, setFicheTechniqueArtisteParPDF] = useState<boolean | null>(null);

    const [contenuExtrasParPDF, setContenuExtrasParPDF] = useState<string | null>(null);
    const [contenuBudgetEstimatifParPDF, setContenuBudgetEstimatifParPDF] = useState<string | null>(null);
    const [contenuConditionsFinancieresParPDF, setContenuConditionsFinancieresParPDF] = useState<string | null>(null);
    const [contenuFicheTechniqueArtisteParPDF, setContenuFicheTechniqueArtisteParPDF] = useState<string | null>(null);

    const [messageAucunFichier, setMessageAucunFichier] = useState<string | null>(null);

    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError] = useState(false);

    const [donneesSauvegardees, setDonneesSauvegardees] = useState(false);
    
    // const optionsDate: Intl.DateTimeFormatOptions = {
    //     year: 'numeric',
    //     month: 'long',
    //     day: 'numeric',
    //     hour: '2-digit',
    //     minute: '2-digit',
    //     timeZoneName: 'short'
    // };

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleSubmitNumber = (): void => {
        setIsModalOpen(false);
    };

    const handleCommentSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        setLoading(true);
        e.preventDefault();
    
        if (!commentaire.trim()) {
          setError("Le commentaire ne peut pas être vide.");
          return;
        }
        setError("");
    
        await apiGet("/me").then(async (response) => {
            setUsername(response.utilisateur);
            const data = JSON.stringify({
            commentaire: {
                idOffre: project?.id,
                username: response.utilisateur,
                contenu: commentaire,
            },
        });

        try {
            await apiPost("/commentaire/create", JSON.parse(data)).then((response) => {
                e.preventDefault();

                if (response.error) {
                    throw new Error(response.error);
                }
                setCommentaires([JSON.parse(response.commentaire), ...commentaires]);
            });
            setCommentaire("");
            setLoading(false);
        } catch (err) {
            setError("Une erreur est survenue lors de l'ajout du commentaire.");
            throw err;
            }
        });
    };

    function calculBudgetTotal(BudgetEstimatif: BudgetEstimatif) {
        return BudgetEstimatif.cachetArtiste + 
            BudgetEstimatif.fraisDeplacement + 
            BudgetEstimatif.fraisHebergement + 
            BudgetEstimatif.fraisRestauration;
    }

    function calculPrixTotalReponsesRecu(reponses: Reponse[]) {
        let total = 0;
        let nbContributions = 0;
        const reponsesValidees: Reponse[] = [];
        reponses.forEach((reponse) => {
            if (reponse.etatReponse.nomEtatReponse === "Validée") {
                reponsesValidees.push(reponse);
                total += reponse.prixParticipation;
                nbContributions++;
            }
        });
        setReponsesValidees(reponsesValidees);
        setNbContributions(nbContributions);
        setBudgetTotalReponsesRecu(total);
        return total;
    }

    function calculPourcentageBudgetRecu() {
        return (pourcentageBudgetRecu / budgetTotal) * 100;
    }

    function base64ToArrayBuffer(base64: string): ArrayBuffer {
        const binaryString = atob(base64);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes.buffer;
    }

    const setProjectProps = useCallback((project: Project) => {
        const listeLiensPromo = project.liensPromotionnels.split(';')
        listeLiensPromo.pop();
        setLiensPromotionnelsList(listeLiensPromo);

        const data: FormData = {
            detailOffre: {
                id: project.id,
                titleOffre: project.titleOffre,
                deadLine: project.deadLine,
                descrTournee: project.descrTournee,
                dateMinProposee: project.dateMinProposee,
                dateMaxProposee: project.dateMaxProposee,
                villeVisee: project.villeVisee,
                regionVisee: project.regionVisee,
                placesMin: project.placesMin,
                placesMax: project.placesMax,
                nbArtistesConcernes: project.nbArtistesConcernes,
                nbInvitesConcernes: project.nbInvitesConcernes
            },
            extras: {
                extrasParPDF: extrasParPDF,
                descrExtras: project.extras?.descrExtras,
                coutExtras: project.extras?.coutExtras,
                exclusivite: project.extras?.exclusivite,
                exception: project.extras?.exception,
                clausesConfidentialites: project.extras?.clausesConfidentialites
            },
            etatOffre: {
                nomEtatOffre: project.etatOffre.nomEtat
            },
            typeOffre: {
                nomTypeOffre: project.typeOffre.nomTypeOffre
            },
            conditionsFinancieres: {
                conditionsFinancieresParPDF: conditionsFinancieresParPDF,
                minimunGaranti: project.conditionsFinancieres?.minimunGaranti,
                conditionsPaiement: project.conditionsFinancieres?.conditionsPaiement,
                pourcentageRecette: project.conditionsFinancieres?.pourcentageRecette
            },
            budgetEstimatif: {
                budgetEstimatifParPDF: budgetEstimatifParPDF,
                cachetArtiste: project.budgetEstimatif?.cachetArtiste,
                fraisDeplacement: project.budgetEstimatif?.fraisDeplacement,
                fraisHebergement: project.budgetEstimatif?.fraisHebergement,
                fraisRestauration: project.budgetEstimatif?.fraisRestauration
            },
            ficheTechniqueArtiste: {
                ficheTechniqueArtisteParPDF: ficheTechniqueArtisteParPDF,
                besoinBackline: project.ficheTechniqueArtiste?.besoinBackline,
                besoinEclairage: project.ficheTechniqueArtiste?.besoinEclairage,
                besoinEquipements: project.ficheTechniqueArtiste?.besoinEquipements,
                besoinScene: project.ficheTechniqueArtiste?.besoinScene,
                besoinSonorisation: project.ficheTechniqueArtiste?.besoinSonorisation,
                ordrePassage: project.extras?.ordrePassage,
                liensPromotionnels: listeLiensPromo || [],
                artiste: project.artistes || [],
                nbArtistes: project.artistes.length
            },
            donneesSupplementaires: {
                reseau: project.reseaux,
                nbReseaux: project.reseaux.length,
                genreMusical: project.genresMusicaux,
                nbGenresMusicaux: project.genresMusicaux.length,
            },
            utilisateur: {
                username : project.utilisateur.username
            },
            image: {
                file: project.image ? base64ToArrayBuffer(project.image) : null,
            }
        };
        setFormData(data);
    }, [budgetEstimatifParPDF, conditionsFinancieresParPDF, extrasParPDF, ficheTechniqueArtisteParPDF]);

    useEffect(() => {
        const fetchDetailOffre = async (id: number) => {
            await apiGet(`/offre/${id}`).then((response) => {
                const allCommentaires: Commentaire[] = [];
                response.offre.commenteesPar.forEach((commentaire: { id: number }) => {
                    fetchCommentaire(commentaire.id).then((commentaireData: Commentaire | Commentaire[]) => {
                        if (Array.isArray(commentaireData)) {
                            allCommentaires.push(...commentaireData);
                        } else {
                            allCommentaires.push(commentaireData); 
                        }
                        if (allCommentaires.length === response.offre.commenteesPar.length) {
                            setCommentaires(allCommentaires.sort((a, b) => b.id - a.id));
                        }
                    });
                });
                if (response.offre.budgetEstimatif) {
                    setBudgetEstimatifParPDF(false);
                    setBudgetTotal(calculBudgetTotal(response.offre.budgetEstimatif));
                } else {
                    setBudgetEstimatifParPDF(true);
                }
                if (response.offre.extras) {
                    setExtrasParPDF(false);
                } else {
                    setExtrasParPDF(true);
                }
                if (response.offre.conditionsFinancieres) {
                    setConditionsFinancieresParPDF(false);
                } else {
                    setConditionsFinancieresParPDF(true);
                }
                if (response.offre.ficheTechniqueArtiste) {
                    setFicheTechniqueArtisteParPDF(false);
                } else {
                    setFicheTechniqueArtisteParPDF(true);
                }
                setProject(response.offre);
                setProjectProps(response.offre);
            });
        };

        const fetchReponsesOffre = async (id: number) => {
            await apiGet(`/reponses/offre/${id}`).then(async (response) => {
                setPourcentageBudgetRecu(calculPrixTotalReponsesRecu(JSON.parse(response.reponses)));
            });
        };

        fetchDetailOffre(id);
        fetchReponsesOffre(id);
    }, [id, setProjectProps]);

    useEffect(() => {
        const getUsername = async () => {
            await apiGet(`/me`).then((response) => {
                setUsername(response.utilisateur);
            });
        }

        getUsername();
    }, []);

    function estCreateurOffre() {
        return project?.utilisateur.username === username;
    }

    // function convertitDateLisibleHumain(date: string) {
    //     return new Date(date).toLocaleDateString('fr-FR', optionsDate);
    // }

    function calculateTimeLeft(deadline: string): TimeLeft | null {
        const now = new Date();
        const endDate = new Date(deadline);
        const diff = endDate.getTime() - now.getTime();

        if (diff <= 0) return null;

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);

        return { days, hours, minutes, seconds };
    }

    useEffect( () => {
        const fetchFichiersProjet = async () => {
            const data = {
                idProjet: project?.id,
            };
            await apiPost('/get-sftp-fichiers', JSON.parse(JSON.stringify(data))).then(
                (response) => {
                    if (response.message_none_files) {
                        setMessageAucunFichier(response.message_none_files);
                    } else {
                        if (response.files.budget_estimatif != null) {
                            setContenuBudgetEstimatifParPDF(response.files.budget_estimatif.content);
                        } else {
                            setContenuBudgetEstimatifParPDF(null);
                        }
                        if (response.files.extras != null) {
                            setContenuExtrasParPDF(response.files.extras.content);
                        } else {
                            setContenuExtrasParPDF(null);
                        }
                        if (response.files.conditions_financieres != null) {
                            setContenuConditionsFinancieresParPDF(response.files.conditions_financieres.content);
                        } else {
                            setContenuConditionsFinancieresParPDF(null);
                        }
                        if (response.files.fiche_technique_artiste != null) {
                            setContenuFicheTechniqueArtisteParPDF(response.files.fiche_technique_artiste.content);
                        } else {
                            setContenuFicheTechniqueArtisteParPDF(null);
                        }
                    }
                }
            );
        };

        if (project) {
            const timer = setInterval(() => {
                setTimeLeft(calculateTimeLeft(project.deadLine));
            }, 1000);

            fetchFichiersProjet();

            return () => clearInterval(timer);
        }
    }, [project]);

    if (!project) {
        return <div className="flex items-center justify-center text-2xl min-h-[50vh]">
            <span>Chargement des détails du projet en cours...</span>
            <Spinner className="ml-4" />
        </div>;
    }

    function checkImageExist(image: string | null) {
        return image ? `data:image/jpg;base64,${image}` : '/image-default-offre.jpg';
    }

    const handleDelete = async () => {
        await apiDelete(`/offre/delete/${project.id}`);
        alert("Offre supprimée avec succès.");
        window.location.href = "/networks";
    };

    const handleModify = async () => {
        try {
            await apiPatch(`/offre/update/${project.id}`, JSON.parse(JSON.stringify(formData))).then(() => {
                setShowModifyOffre(false);
                setShowSuccess(true);
                setTimeout(() => {
                    setShowSuccess(false);
                }, 3000);
            });
            const data = {
                'projectName' : formData.detailOffre.titleOffre,
                'projectDescription' : formData.detailOffre.descrTournee,
                'username' : formData.utilisateur.username,
                'offreId' : project.id
            };
            await apiPost('/envoi-email-update-projet', JSON.parse(JSON.stringify(data)));
            // window.location.href = "/networks";
        } catch (error) {
            console.error("Erreur réseau :", error);
            setShowError(true);
            setTimeout(() => {
                setShowError(false);
            }, 3000);
        }
    };

    return (
        <div className="w-full flex items-center justify-center">
            <div className="container mx-auto mb-10">
                {showSuccess && (
                        <div className="fixed top-4 right-4 z-50">
                        <Toast>
                            <HiCheck className="h-5 w-5 text-green-500" />
                            <div className="ml-3 text-sm font-normal">
                                Projet modifié avec succès
                            </div>

                            {/* Barre de vie */}
                            <div className="absolute bottom-0 left-0 h-1 w-full bg-green-200">
                            <div
                                className="h-full bg-green-500 transition-all duration-3000"
                                style={{
                                animation: "shrink 3s linear forwards",
                                }}
                            ></div>
                            </div>
                        </Toast>

                        <style jsx>{`
                            @keyframes shrink {
                            from {
                                width: 100%;
                            }
                            to {
                                width: 0%;
                            }
                            }
                        `}</style>
                        </div>
                    )}

                    {showError && (
                        <div className="fixed top-4 right-4 z-50">
                        <Toast>
                            <HiCheck className="h-5 w-5 text-red-500" />
                            <div className="ml-3 text-sm font-normal">
                                Erreur lors de la sauvegarde du projet
                            </div>

                            {/* Barre de vie */}
                            <div className="absolute bottom-0 left-0 h-1 w-full bg-red-200">
                            <div
                                className="h-full bg-red-500 transition-all duration-3000"
                                style={{
                                animation: "shrink 3s linear forwards",
                                }}
                            ></div>
                            </div>
                        </Toast>

                        <style jsx>{`
                            @keyframes shrink {
                            from {
                                width: 100%;
                            }
                            to {
                                width: 0%;
                            }
                            }
                        `}</style>
                        </div>
                    )}
                <h1 className="text-4xl font-bold mb-4 mt-6 text-center">{project.titleOffre}</h1>
                <p className="text-xl mb-12 text-center">{project.descrTournee}</p>

                <div className="flex flex-col md:flex-row ml-[10%] mr-[10%] px-8">
                    <div className="md:w-1/2 md:pr-4 mb-8 md:mb-0">
                        <Image 
                            src={checkImageExist(project.image)}
                            width={200}
                            height={200} 
                            alt={project.titleOffre} 
                            className="w-full h-full" 
                        />
                    </div>
                    <div className="md:w-1/2 md:pl-4">
                        <div className="mb-6 flex items-center mt-5">
                            <Avatar
                                alt="User settings"
                                img="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                                rounded
                                className="h-10 w-10 mr-5"
                            />
                            <h2 className="text-2xl font-semibold">{project.utilisateur.username}</h2>
                        </div>
                        <div className="rounded-lg mb-8">
                            <div className="flex justify-between mb-4">
                                <div>
                                    <p className="text-xl font-bold">{budgetTotalReponsesRecu} €</p>
                                    <p>sur {budgetTotal} €</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xl font-bold">{nbContributions}</p>
                                    <p>Contributions</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xl font-bold">
                                        {timeLeft ? 
                                            `${timeLeft.days}j ${timeLeft.hours}h ${timeLeft.minutes}m ${timeLeft.seconds}s` : 
                                            'Fin de l\'offre, la date de contribution est dépassée'
                                        }
                                    </p>
                                    <p>Date de fin</p>
                                </div>
                            </div>
                            <Progress
                                color="green"
                                progress={calculPourcentageBudgetRecu()}
                                //label={`${Math.round((150 / 500) * 100)}%`}
                            />
                        </div>
                        <div className="flex justify-center space-x-4">
                            {estCreateurOffre() && (
                                <NavigationHandler>
                                    {(handleNavigation) => (
                                        <Button
                                            onClick={() => handleNavigation(`/propositions/${id}`)}
                                        >
                                            Les propositions de l&apos;offre
                                        </Button>
                                    )}
                                </NavigationHandler>
                            )}
                            <Button color="info" onClick={handleOpenModal} disabled={timeLeft === null}>
                                Répondre
                            </Button>
                            <NumberInputModal
                                username={username}
                                isOpen={isModalOpen}
                                onClose={handleCloseModal}
                                onSubmit={handleSubmitNumber}
                            />
                        </div>
                    </div>
                </div>

                <div>
                    <Tabs
                        aria-label="Tabs pour les onglets de détails, commentaires et contributions"
                        onActiveTabChange={(tab) => setActiveTab(tab)}
                        className='mx-auto mt-5'
                    >
                        <Tabs.Item title="Détails du projet" active={activeTab === 1}>
                            <div className='ml-[10%] mr-[10%] px-8'>
                                <div className="flex flex-col space-y-4">
                                    {/* Informations principales */}
                                    <Card>
                                        <div>
                                            <h3 className="font-medium">Détails du Projet</h3>
                                            <p>Les informations principales sur le projet sont listées ci-dessous.</p>
                                        </div>
                                        <div>
                                            <dl className="sm:divide-y">
                                                <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                                    <dt className="font-medium">Titre</dt>
                                                    <dd className="mt-1 sm:mt-0 sm:col-span-2">{project.titleOffre}</dd>
                                                </div>
                                                <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                                    <dt className="font-medium">Description</dt>
                                                    <dd className="mt-1 sm:mt-0 sm:col-span-2">{project.descrTournee}</dd>
                                                </div>
                                                <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                                    <dt className="font-medium">Date maximale de contribution</dt>
                                                    <dd className="mt-1 sm:mt-0 sm:col-span-2">{new Date(project.deadLine).toLocaleDateString()}</dd>
                                                </div>
                                                <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                                    <dt className="font-medium">Date Minimum Proposée</dt>
                                                    <dd className="mt-1 sm:mt-0 sm:col-span-2">{new Date(project.dateMinProposee).toLocaleDateString()}</dd>
                                                </div>
                                                <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                                    <dt className="font-medium">Date Maximum Proposée</dt>
                                                    <dd className="mt-1 sm:mt-0 sm:col-span-2">{new Date(project.dateMaxProposee).toLocaleDateString()}</dd>
                                                </div>
                                                <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                                    <dt className="font-medium">Places Minimales</dt>
                                                    <dd className="mt-1 sm:mt-0 sm:col-span-2">{project.placesMin}</dd>
                                                </div>
                                                <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                                    <dt className="font-medium">Places Maximales</dt>
                                                    <dd className="mt-1 sm:mt-0 sm:col-span-2">{project.placesMax}</dd>
                                                </div>
                                            </dl>
                                        </div>
                                    </Card>

                                    {/* Informations Supplémentaires */}
                                    <Card>
                                        <div>
                                            <h3 className="font-medium">Détails Complémentaires</h3>
                                            <p>Autres informations sur le projet.</p>
                                        </div>
                                        <div>
                                            <dl className="sm:divide-y">
                                                <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                                    <dt className="font-medium">Région Visée</dt>
                                                    <dd className="mt-1 sm:mt-0 sm:col-span-2">{project.regionVisee}</dd>
                                                </div>
                                                <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                                    <dt className="font-medium">Ville Visée</dt>
                                                    <dd className="mt-1 sm:mt-0 sm:col-span-2">{project.villeVisee}</dd>
                                                </div>
                                                <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                                    <dt className="font-medium">Type d&apos;Offre</dt>
                                                    <dd className="mt-1 sm:mt-0 sm:col-span-2">{project.typeOffre.nomTypeOffre}</dd>
                                                </div>
                                            </dl>
                                        </div>
                                    </Card>

                                    {/* Artistes et Réseaux */}
                                    <Card>
                                        <div>
                                            <h3 className="font-medium">Artistes et Réseaux</h3>
                                            <p>Liste des artistes et réseaux impliqués dans ce projet.</p>
                                        </div>
                                        <div>
                                            <dl className="sm:divide-y">
                                                <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                                    <dt className="font-medium">Artistes</dt>
                                                    <dd className="mt-1 sm:mt-0 sm:col-span-2">
                                                        {project.artistes.length > 0 ? project.artistes.map((artiste, index) => (
                                                            <span key={index}>{artiste.nomArtiste}, </span>
                                                        )) : "Aucun artiste lié au projet"}
                                                    </dd>
                                                </div>
                                                <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                                    <dt className="font-medium">Réseaux</dt>
                                                    <dd className="mt-1 sm:mt-0 sm:col-span-2">
                                                        {project.reseaux.map((reseau, index) => (
                                                            <span key={index}>{reseau.nomReseau}, </span>
                                                        ))}
                                                    </dd>
                                                </div>
                                            </dl>
                                        </div>
                                    </Card>

                                    {/* Budget Estimatif */}
                                    {formData.budgetEstimatif.budgetEstimatifParPDF != true ? <Card>
                                        <div>
                                            <h3 className="font-medium">Budget Estimatif</h3>
                                            <p>Aperçu des coûts estimés pour ce projet.</p>
                                        </div>
                                        <div>
                                            <dl className="sm:divide-y">
                                                <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                                    <dt className="font-medium">Cachet Artiste</dt>
                                                    <dd className="mt-1 sm:mt-0 sm:col-span-2">{formData.budgetEstimatif.cachetArtiste} €</dd>
                                                </div>
                                                <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                                    <dt className="font-medium">Frais de Déplacement</dt>
                                                    <dd className="mt-1 sm:mt-0 sm:col-span-2">{formData.budgetEstimatif.fraisDeplacement} €</dd>
                                                </div>
                                                <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                                    <dt className="font-medium">Frais d&apos;Hébergement</dt>
                                                    <dd className="mt-1 sm:mt-0 sm:col-span-2">{formData.budgetEstimatif.fraisHebergement} €</dd>
                                                </div>
                                                <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                                    <dt className="font-medium">Frais de Restauration</dt>
                                                    <dd className="mt-1 sm:mt-0 sm:col-span-2">{formData.budgetEstimatif.fraisRestauration} €</dd>
                                                </div>
                                            </dl>
                                        </div>
                                    </Card> : 
                                    contenuBudgetEstimatifParPDF && <Card>
                                        <div>
                                            <h3 className="font-medium">Budget estimatif</h3>
                                        </div>
                                        <div>
                                            <dl className="sm:divide-y">
                                                <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                                    <dt className="font-medium">Document de liaison</dt>
                                                    <dd className="mt-1 sm:mt-0 sm:col-span-2">
                                                        <div className='flex'>
                                                            <DownloadButton donneePDFbase64={contenuBudgetEstimatifParPDF} />
                                                        </div>
                                                    </dd>
                                                </div>
                                            </dl>
                                        </div>
                                    </Card>}

                                    {/* Extras de l&apos;évènement */}
                                    {formData.extras.extrasParPDF != true ? <Card>
                                        <div>
                                            <h3 className="font-medium">Extras</h3>
                                            <p>Aperçu des extras pour le projet.</p>
                                        </div>
                                        <div>
                                            <dl className="sm:divide-y">
                                                <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                                    <dt className="font-medium">Description de l&apos;extras</dt>
                                                    <dd className="mt-1 sm:mt-0 sm:col-span-2">{formData.extras.descrExtras}</dd>
                                                </div>
                                                <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                                    <dt className="font-medium">Exclusivité</dt>
                                                    <dd className="mt-1 sm:mt-0 sm:col-span-2">{formData.extras.exclusivite}</dd>
                                                </div>
                                                <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                                    <dt className="font-medium">Coût de l&apos;extras</dt>
                                                    <dd className="mt-1 sm:mt-0 sm:col-span-2">{formData.extras.coutExtras} €</dd>
                                                </div>
                                                <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                                    <dt className="font-medium">Exception</dt>
                                                    <dd className="mt-1 sm:mt-0 sm:col-span-2">{formData.extras.exception}</dd>
                                                </div>
                                                <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                                    <dt className="font-medium">Clauses de confidentialité</dt>
                                                    <dd className="mt-1 sm:mt-0 sm:col-span-2">{formData.extras.clausesConfidentialites}</dd>
                                                </div>
                                            </dl>
                                        </div>
                                    </Card> : 
                                    contenuExtrasParPDF && <Card>
                                        <div>
                                            <h3 className="font-medium">Extras</h3>
                                        </div>
                                        <div>
                                            <dl className="sm:divide-y">
                                                <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                                    <dt className="font-medium">Document de liaison</dt>
                                                    <dd className="mt-1 sm:mt-0 sm:col-span-2">
                                                        <div className='flex'>
                                                            <DownloadButton donneePDFbase64={contenuExtrasParPDF} />
                                                        </div>
                                                    </dd>
                                                </div>
                                            </dl>
                                        </div>
                                    </Card>}

                                    {/* Conditions financière de l&apos;évènement */}
                                    {formData.conditionsFinancieres.conditionsFinancieresParPDF != true ? <Card>
                                        <div>
                                            <h3 className="font-medium">Conditions financières</h3>
                                            <p>Aperçu des conditions financières du projet.</p>
                                        </div>
                                        <div>
                                            <dl className="sm:divide-y">
                                                <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                                    <dt className="font-medium">Le minimum garanti (en €)</dt>
                                                    <dd className="mt-1 sm:mt-0 sm:col-span-2">{formData.conditionsFinancieres.minimunGaranti} €</dd>
                                                </div>
                                                <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                                    <dt className="font-medium">Les conditions de paiement</dt>
                                                    <dd className="mt-1 sm:mt-0 sm:col-span-2">{formData.conditionsFinancieres.conditionsPaiement}</dd>
                                                </div>
                                                <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                                    <dt className="font-medium">Le pourcentage de la recette</dt>
                                                    <dd className="mt-1 sm:mt-0 sm:col-span-2">{formData.conditionsFinancieres.pourcentageRecette} %</dd>
                                                </div>
                                            </dl>
                                        </div>
                                    </Card> : 
                                    contenuConditionsFinancieresParPDF && <Card>
                                        <div>
                                            <h3 className="font-medium">Conditions financières</h3>
                                        </div>
                                        <div>
                                            <dl className="sm:divide-y">
                                                <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                                    <dt className="font-medium">Document de liaison</dt>
                                                    <dd className="mt-1 sm:mt-0 sm:col-span-2">
                                                        <div className='flex'>
                                                            <DownloadButton donneePDFbase64={contenuConditionsFinancieresParPDF} />
                                                        </div>
                                                    </dd>
                                                </div>
                                            </dl>
                                        </div>
                                    </Card>}

                                    {/* La fiche technique de l&apos;artiste */}
                                    {formData.ficheTechniqueArtiste.ficheTechniqueArtisteParPDF != true ? <Card>
                                        <div>
                                            <h3 className="font-medium">Fiche technique de l&apos;artiste</h3>
                                            <p>Aperçu des besoins et des informations liés à l&apos;artiste.</p>
                                        </div>
                                        <div>
                                            <dl className="sm:divide-y">
                                                <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                                    <dt className="font-medium">Le besoin en backline</dt>
                                                    <dd className="mt-1 sm:mt-0 sm:col-span-2">{formData.ficheTechniqueArtiste.besoinBackline}</dd>
                                                </div>
                                                <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                                    <dt className="font-medium">Le besoin en éclairage</dt>
                                                    <dd className="mt-1 sm:mt-0 sm:col-span-2">{formData.ficheTechniqueArtiste.besoinEclairage}</dd>
                                                </div>
                                                <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                                    <dt className="font-medium">Le besoin en équipements</dt>
                                                    <dd className="mt-1 sm:mt-0 sm:col-span-2">{formData.ficheTechniqueArtiste.besoinEquipements}</dd>
                                                </div>
                                                <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                                    <dt className="font-medium">Le besoin en scène</dt>
                                                    <dd className="mt-1 sm:mt-0 sm:col-span-2">{formData.ficheTechniqueArtiste.besoinScene}</dd>
                                                </div>
                                                <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                                    <dt className="font-medium">Le besoin en sonorisation</dt>
                                                    <dd className="mt-1 sm:mt-0 sm:col-span-2">{formData.ficheTechniqueArtiste.besoinSonorisation}</dd>
                                                </div>
                                                <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                                    <dt className="font-medium">Ses liens promotionnels</dt>
                                                    {liensPromotionnelsList ? liensPromotionnelsList.map((lien: string, index: number) => {
                                                        return <div className='flex items-center' key={`${index}`}>
                                                            <FaLink className='mr-2'/>
                                                            <a href={lien}>
                                                                <dd className="mt-1 sm:mt-0 sm:col-span-2">{lien}</dd>
                                                            </a>
                                                        </div>
                                                    }) : <dd className="mt-1 sm:mt-0 sm:col-span-2">Aucun liens promotionnels</dd>}
                                                </div>
                                                <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                                    <dt className="font-medium">L&apos;ordre de passage</dt>
                                                    <dd className="mt-1 sm:mt-0 sm:col-span-2">{formData.ficheTechniqueArtiste.ordrePassage}</dd>
                                                </div>
                                            </dl>
                                        </div>
                                    </Card> : 
                                    contenuFicheTechniqueArtisteParPDF && <Card>
                                        <div>
                                            <h3 className="font-medium">Fiche technique de l&apos;artiste</h3>
                                        </div>
                                        <div>
                                            <dl className="sm:divide-y">
                                                <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                                    <dt className="font-medium">Document de liaison</dt>
                                                    <dd className="mt-1 sm:mt-0 sm:col-span-2">
                                                        <div className='flex'>
                                                            <DownloadButton donneePDFbase64={contenuFicheTechniqueArtisteParPDF} />
                                                        </div>
                                                    </dd>
                                                </div>
                                            </dl>
                                        </div>
                                    </Card>}

                                    {messageAucunFichier && <Card>
                                        <div>
                                            <h3 className="font-medium">{messageAucunFichier}</h3>
                                        </div>
                                    </Card>}
                                </div>

                                <div>
                                    {estCreateurOffre() ? (
                                        <div className="flex justify-between items-center mt-4 mb-4">
                                            <h3 className="font-medium">Actions possible sur le projet</h3>
                                            <div className='flex space-x-4'>
                                                <Button onClick={() => setShowModifyOffre(true)} color='warning' className="font-medium">Modifier</Button>
                                                <Button onClick={() => setShowDeleteModal(true)} color='failure' className="font-medium">Supprimer</Button>
                                            </div>
                                        </div>
                                    ) : null}
                                </div>

                                {/* Modal de confirmation */}
                                <Modal
                                    show={showDeleteModal}
                                    onClose={() => setShowDeleteModal(false)}
                                    >
                                    <Modal.Header>Confirmation</Modal.Header>
                                    <Modal.Body>
                                        <p>Êtes-vous sûr de vouloir supprimer cette offre ? Cette action est irréversible.</p>
                                    </Modal.Body>
                                    <Modal.Footer>
                                        {/* Boutons dans le modal */}
                                        <Button color="gray" onClick={() => setShowDeleteModal(false)}>
                                        Annuler
                                        </Button>
                                        <Button color="failure" onClick={handleDelete}>
                                        Confirmer
                                        </Button>
                                    </Modal.Footer>
                                </Modal>

                                 {/* Modal de confirmation */}
                                 <Modal
                                    show={showModifyOffre}
                                    onClose={() => setShowModifyOffre(false)}
                                    size="7xl"
                                >
                                    <Modal.Header>Modification du projet</Modal.Header>
                                    <Modal.Body>
                                        <ModifierOffreForm 
                                            project={formData}
                                            onProjectInformationsChange={(updatedInformationsProject: FormData) => setFormData(updatedInformationsProject)}
                                            onDonneesSauvegardees={(donneeSauvegarde: boolean) => setDonneesSauvegardees(donneeSauvegarde)}
                                            //onProjectDetailChange={(updatedDetailProject: FormData) => setFormData(updatedDetailProject)}
                                            //onProjectExtrasChange={(updatedExtrasProject: FormData) => setFormData(updatedExtrasProject)}
                                            //onProjectBudgetEstimatifChange={(updatedBudgetEstimatifProject: FormData) => setFormData(updatedBudgetEstimatifProject)}
                                            //onProjectFicheTechniqueArtisteChange={(updatedFicheTechniqueArtisteProject: FormData) => setFormData(updatedFicheTechniqueArtisteProject)}
                                            //onProjectConditionsFinancieresChange={(updatedConditionsFinancieresProject: FormData) => setFormData(updatedConditionsFinancieresProject)}
                                            //onProjectDonneesSupplementaireChange={(updatedDonneesSupplementairesProject: FormData) => setFormData(updatedDonneesSupplementairesProject)}
                                        />
                                    </Modal.Body>
                                    <Modal.Footer>
                                        {/* Boutons dans le modal */}
                                        <Button color="gray" onClick={() => setShowModifyOffre(false)}>
                                            Annuler
                                        </Button>
                                        <Button color="success" onClick={handleModify} disabled={!donneesSauvegardees}>
                                            Modifier
                                        </Button>
                                    </Modal.Footer>
                                </Modal>

                            </div>
                        </Tabs.Item>

                        <Tabs.Item title={`Espace commentaires : ${commentaires.length}`} active={activeTab === 2}>
                            <div className='ml-[20%] mr-[20%]'>
                                <h2 className="font-semibold text-lg mb-4">Commentaires</h2>
                                <form onSubmit={handleCommentSubmit}>
                                    <Textarea
                                        value={commentaire}
                                        onChange={(e) => setCommentaire(e.target.value)}
                                        placeholder="Écrivez un commentaire..."
                                        rows={4}
                                        required
                                        className="mb-2"
                                    />
                                    {error && <p className="text-red-500">{error}</p>}
                                    <Button type="submit" disabled={loading}>
                                        {loading ? "Envoi..." : "Poster le commentaire"}
                                    </Button>
                                </form>
                                <div className="mt-6">
                                    {commentaires.length > 0 ? (
                                        <CommentaireSection commentaires={commentaires} />
                                    ) : (
                                        <p>Aucun commentaire pour le moment.</p>
                                    )}
                                </div>
                            </div>
                        </Tabs.Item>

                        <Tabs.Item title={`Les différentes contributions : ${nbContributions}`} active={activeTab === 3}>
                            <div className="ml-[20%] mr-[20%]">
                                <h2 className="font-semibold text-lg mb-4">Contributions</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {reponsesValidees && reponsesValidees.length > 0 ? (
                                        reponsesValidees.map((reponse, index) => (
                                            <div key={index}>
                                                <Card className="hover:shadow-lg transition-shadow">
                                                    <div className="flex items-center space-x-4">
                                                        <Avatar
                                                            img={`https://flowbite.com/docs/images/people/profile-picture-${(index % 5) + 1}.jpg`}
                                                            rounded={true}
                                                            alt={`Avatar de ${reponse.utilisateur.username}`}
                                                        />
                                                        <div>
                                                            <h5 className="text-lg font-medium">{reponse.utilisateur.username}</h5>
                                                            <p className="text-gray-600">
                                                                A contribué : {reponse.prixParticipation} €
                                                            </p>
                                                        </div>
                                                    </div>
                                                </Card>
                                            </div>
                                        ))
                                    ) : (
                                        <p className=" col-span-full">Aucune contribution trouvée.</p>
                                    )}
                                </div>
                            </div>
                        </Tabs.Item>
                    </Tabs>
                </div>
            </div>
        </div>
    );
}

export default function ProjectDetails() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center">Chargement...</div>}>
            <ProjectDetailsContent/>
        </Suspense>
    );
}


// export default ProjectDetailsContent;