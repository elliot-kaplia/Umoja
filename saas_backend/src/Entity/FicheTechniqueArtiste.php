<?php

namespace App\Entity;

use App\Repository\FicheTechniqueArtisteRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Serializer\Annotation\MaxDepth;

#[ORM\Entity(repositoryClass: FicheTechniqueArtisteRepository::class)]
class FicheTechniqueArtiste
{
    #[ORM\Id]
    #[ORM\GeneratedValue(strategy: "SEQUENCE")]
    #[ORM\Column]
    #[Groups(['fiche_technique_artiste:read'])]
    private int $id;

    #[ORM\Column(type: Types::TEXT, nullable: false)]
    #[Groups(['fiche_technique_artiste:read', 'fiche_technique_artiste:write'])]
    private string $besoinSonorisation;

    #[ORM\Column(type: Types::TEXT, nullable: false)]
    #[Groups(['fiche_technique_artiste:read', 'fiche_technique_artiste:write'])]
    private string $besoinEclairage;

    #[ORM\Column(type: Types::TEXT, nullable: false)]
    #[Groups(['fiche_technique_artiste:read', 'fiche_technique_artiste:write'])]
    private string $besoinScene;

    #[ORM\Column(type: Types::TEXT, nullable: false)]
    #[Groups(['fiche_technique_artiste:read', 'fiche_technique_artiste:write'])]
    private string $besoinBackline;

    #[ORM\Column(type: Types::TEXT, nullable: false)]
    #[Groups(['fiche_technique_artiste:read', 'fiche_technique_artiste:write'])]
    private string $besoinEquipements;

    #[ORM\OneToMany(
        targetEntity: Offre::class,
        mappedBy: "ficheTechniqueArtiste",
        orphanRemoval: true,
        cascade: ["remove"]
    )]
    #[Groups(['fiche_technique_artiste:read'])]
    #[MaxDepth(1)]
    private Collection $offres;

    public function __construct()
    {
        $this->offres = new ArrayCollection();
    }

    /**
     * Récupère l'identifiant de la fiche technique.
     *
     * @return int
     */
    public function getId(): int
    {
        return $this->id;
    }

    /**
     * Définit l'identifiant de la fiche technique.
     *
     * @param int $id
     */
    public function setId(int $id): static
    {
        $this->id = $id;

        return $this;
    }

    /**
     * Récupère les besoins en sonorisation de l'offre.
     *
     * @return string
     */
    public function getBesoinSonorisation(): string
    {
        return $this->besoinSonorisation;
    }

    /**
     * Définit les besoins en sonorisation de l'offre.
     *
     * @param string $besoinSonorisation
     * @return static
     */
    public function setBesoinSonorisation(string $besoinSonorisation): static
    {
        $this->besoinSonorisation = $besoinSonorisation;

        return $this;
    }

    /**
     * Récupère les besoins en éclairage de l'offre.
     *
     * @return string
     */
    public function getBesoinEclairage(): string
    {
        return $this->besoinEclairage;
    }

    /**
     * Définit les besoins en éclairage de l'offre.
     *
     * @param string $besoinEclairage
     * @return static
     */
    public function setBesoinEclairage(string $besoinEclairage): static
    {
        $this->besoinEclairage = $besoinEclairage;

        return $this;
    }

    /**
     * Récupère les besoins en scène de l'offre.
     *
     * @return string
     */
    public function getBesoinScene(): string
    {
        return $this->besoinScene;
    }

    /**
     * Définit les besoins en scène de l'offre.
     *
     * @param string $besoinScene
     * @return static
     */
    public function setBesoinScene(string $besoinScene): static
    {
        $this->besoinScene = $besoinScene;

        return $this;
    }

    /**
     * Récupère les besoins en backline de l'offre.
     *
     * @return string
     */
    public function getBesoinBackline(): string
    {
        return $this->besoinBackline;
    }

    /**
     * Définit les besoins en backline de l'offre.
     *
     * @param string $besoinBackline
     * @return static
     */
    public function setBesoinBackline(string $besoinBackline): static
    {
        $this->besoinBackline = $besoinBackline;

        return $this;
    }

    /**
     * Récupère les besoins en équipements de l'offre.
     *
     * @return string
     */
    public function getBesoinEquipements(): string
    {
        return $this->besoinEquipements;
    }

    /**
     * Définit les besoins en équipements de l'offre.
     *
     * @param string $besoinEquipements
     * @return static
     */
    public function setBesoinEquipements(string $besoinEquipements): static
    {
        $this->besoinEquipements = $besoinEquipements;

        return $this;
    }

    public function getOffres(): Collection
    {
        return $this->offres;
    }

    public function addOffre(Offre $offre): self
    {
        if (!$this->offres->contains($offre)) {
            $this->offres[] = $offre;
            $offre->setFicheTechniqueArtiste($this);
        }
        return $this;
    }

    public function removeOffre(Offre $offre): self
    {
        if ($this->offres->removeElement($offre)) {
            if ($offre->getFicheTechniqueArtiste() === $this) {
                $offre->setFicheTechniqueArtiste(null);
            }
        }
        return $this;
    }
}
