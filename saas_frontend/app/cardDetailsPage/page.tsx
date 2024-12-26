"use client"

import React, { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { FaFacebookF, FaTwitter, FaLinkedinIn } from 'react-icons/fa';
import { Progress, Button, /*Modal, */Card, Spinner, Textarea, Avatar, Tabs } from 'flowbite-react';
import NumberInputModal from '@/app/components/ui/modalResponse';
import { apiGet, apiPost } from '@/app/services/internalApiClients';
import NavigationHandler from '@/app/navigation/Router';
import CommentaireSection from "@/app/components/Commentaires/CommentaireSection";
import Image from 'next/image';

type ConditionsFinancieres = {
    id: number;
};

type EtatOffre = {
    id: number;
};

type Extras = {
    id: number;
};

type TypeOffre = {
    nomTypeOffre: string;
};

type Utilisateur = {
    username: string;
};
type Project = {
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

async function fetchBudgetEstimatif(idBudgetEstimatif: number): Promise<BudgetEstimatif[]> {
    const response = await apiGet(`/budget-estimatif/${idBudgetEstimatif}`);
    if (!response) {
      throw new Error("Erreur lors de la récupération des détails de l'offre");
    }
    return JSON.parse(response.budget_estimatif);
}

function ProjectDetailsContent({ projects }: { projects: Project[] }) {
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
    const project = projects.find(p => p.id === Number(id));
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<number>(1);
    
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

    const handleSubmitNumber = (startDate: Date | null, endDate: Date | null, price: number | null): void => {
        console.log(startDate, endDate, price);
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
        let reponsesValidees: Reponse[] = [];
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
                fetchBudgetEstimatif(response.offre.budgetEstimatif.id).then((budgetEstimatif) => {
                    setBudgetTotal(calculBudgetTotal(budgetEstimatif[0]));
                });
            });
        };

        const fetchReponsesOffre = async (id: number) => {
            await apiGet(`/reponses/offre/${id}`).then((response) => {
                console.log(JSON.parse(response.reponses));
                setPourcentageBudgetRecu(calculPrixTotalReponsesRecu(JSON.parse(response.reponses)));
            });
        };

        fetchDetailOffre(id);
        fetchReponsesOffre(id);
    }, [id]);

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

    useEffect(() => {
        if (project) {
            const timer = setInterval(() => {
                setTimeLeft(calculateTimeLeft(project.deadLine));
            }, 1000);

            return () => clearInterval(timer); // Nettoyage pour éviter les fuites de mémoire
        }
    }, [project]);

    if (!project) {
        return <div className="flex items-center justify-center text-2xl">
            <p>Chargement des détails de du projet ...</p>
            <Spinner className="ml-4"size='l' />
        </div>;
    }

    function checkImageExist(image: string | null) {
        return image ? `data:image/jpg;base64,${image}` : '/image-default-offre.jpg';
    }

    return (
        <div className="w-full flex items-center justify-center">
            <div className="container mx-auto mb-10">
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
                        <div className="rounded-lg p-6 mb-8">
                            <div className="flex justify-between mb-4">
                                <div>
                                    <p className="text-2xl font-bold">{budgetTotalReponsesRecu} €</p>
                                    <p>sur {budgetTotal} €</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-bold">{nbContributions}</p>
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
                            <Button color="info" onClick={handleOpenModal}>
                                Répondre
                            </Button>
                            <NumberInputModal
                                username={username}
                                isOpen={isModalOpen}
                                onClose={handleCloseModal}
                                onSubmit={handleSubmitNumber}
                            />
                            <Button color="light">
                                <FaFacebookF />
                            </Button>
                            <Button color="light">
                                <FaTwitter />
                            </Button>
                            <Button color="light">
                                <FaLinkedinIn />
                            </Button>
                        </div>
                    </div>
                </div>

                <div>
                    <Tabs
                        aria-label="Tabs for event details"
                        onActiveTabChange={(tab) => setActiveTab(tab)}
                        className='mx-auto mt-5'
                    >
                        <Tabs.Item title="Détails" active={activeTab === 1}>
                            <div className='ml-[20%] mr-[20%]'>
                                <h2 className="font-semibold text-lg mb-4">Détails de l'événement</h2>
                                <p>Description détaillée de l'événement, y compris les informations principales.</p>
                            </div>
                        </Tabs.Item>

                        <Tabs.Item title="Commentaires" active={activeTab === 2}>
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
                                    <h3 className="font-semibold mb-2">Liste des commentaires :</h3>
                                    {commentaires.length > 0 ? (
                                        <CommentaireSection commentaires={commentaires} />
                                    ) : (
                                        <p>Aucun commentaire pour le moment.</p>
                                    )}
                                </div>
                            </div>
                        </Tabs.Item>

                        <Tabs.Item title="Contributions" active={activeTab === 3}>
                            <div className="ml-[20%] mr-[20%]">
                                <h2 className="font-semibold text-lg mb-4">Contributions</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {reponsesValidees && reponsesValidees.length > 0 ? (
                                        reponsesValidees.map((reponse, index) => (
                                            <div key={index}>
                                                <Card className="hover:shadow-lg transition-shadow">
                                                    <div className="flex items-center space-x-4">
                                                        <Avatar
                                                            img={`https://flowbite.com/docs/images/people/profile-picture-${index + 1}.jpg`}
                                                            rounded={true}
                                                            alt={`Avatar de ${reponse.utilisateur.username}`}
                                                        />
                                                        <div>
                                                            <h5 className="text-lg font-medium">{reponse.utilisateur.username}</h5>
                                                            <p className="text-sm text-gray-600">
                                                                A contribué : {reponse.prixParticipation} €
                                                            </p>
                                                        </div>
                                                    </div>
                                                </Card>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-gray-500 col-span-full">Aucune contribution trouvée.</p>
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
    const [projects, setProjects] = useState<Project[]>([]);

    useEffect(() => {
        const fetchProjects = async () => {
            await apiGet('/offres').then((response) => {
                setProjects(response.offres);
                console.log(response.offres);
            });
        };
        fetchProjects();
    }, []);

    return (
        <Suspense fallback={<div className="flex items-center justify-center">Chargement...</div>}>
            <ProjectDetailsContent projects={projects} />
        </Suspense>
    );
}