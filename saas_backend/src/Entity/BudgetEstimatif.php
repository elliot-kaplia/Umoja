<?php

namespace App\Entity;

use App\Repository\BudgetEstimatifRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: BudgetEstimatifRepository::class)]
class BudgetEstimatif
{
    /**
     * Identifiant unique du budget estimatif.
     *
     * @var int|null
     */
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $idBE = null;

    /**
     * Montant du cachet de l'artiste.
     *
     * @var int|null
     */
    #[ORM\Column]
    private ?int $cachetArtiste = null;

    /**
     * Montant des frais de déplacement.
     *
     * @var int|null
     */
    #[ORM\Column]
    private ?int $fraisDeplacement = null;

    /**
     * Montant des frais d'hébergement.
     *
     * @var int|null
     */
    #[ORM\Column]
    private ?int $fraisHebergement = null;

    /**
     * Montant des frais de restauration.
     *
     * @var int|null
     */
    #[ORM\Column]
    private ?int $fraisRestauration = null;

    /**
     * Récupère l'identifiant du budget estimatif.
     *
     * @return int|null
     */
    public function getIdBE(): ?int
    {
        return $this->idBE;
    }

    /**
     * insert l'identifiant du budget estimatif.
     *
     * @return int|null
     */
    public function setIdBE(int $idBE): ?int
    {
        return $this->idBE = $idBE;
    }

    /**
     * Récupère le montant du cachet de l'artiste.
     *
     * @return int|null
     */
    public function getCachetArtiste(): ?int
    {
        return $this->cachetArtiste;
    }

    /**
     * Définit le montant du cachet de l'artiste.
     *
     * @param int $cachetArtiste Montant du cachet à définir.
     * @return static
     */
    public function setCachetArtiste(int $cachetArtiste): static
    {
        $this->cachetArtiste = $cachetArtiste;

        return $this;
    }

    /**
     * Récupère le montant des frais de déplacement.
     *
     * @return int|null
     */
    public function getFraisDeplacement(): ?int
    {
        return $this->fraisDeplacement;
    }

    /**
     * Définit le montant des frais de déplacement.
     *
     * @param int $fraisDeplacement Montant des frais de déplacement à définir.
     * @return static
     */
    public function setFraisDeplacement(int $fraisDeplacement): static
    {
        $this->fraisDeplacement = $fraisDeplacement;

        return $this;
    }

    /**
     * Récupère le montant des frais d'hébergement.
     *
     * @return int|null
     */
    public function getFraisHebergement(): ?int
    {
        return $this->fraisHebergement;
    }

    /**
     * Définit le montant des frais d'hébergement.
     *
     * @param int $fraisHebergement Montant des frais d'hébergement à définir.
     * @return static
     */
    public function setFraisHebergement(int $fraisHebergement): static
    {
        $this->fraisHebergement = $fraisHebergement;

        return $this;
    }

    /**
     * Récupère le montant des frais de restauration.
     *
     * @return int|null
     */
    public function getFraisRestauration(): ?int
    {
        return $this->fraisRestauration;
    }

    /**
     * Définit le montant des frais de restauration.
     *
     * @param int $fraisRestauration Montant des frais de restauration à définir.
     * @return static
     */
    public function setFraisRestauration(int $fraisRestauration): static
    {
        $this->fraisRestauration = $fraisRestauration;

        return $this;
    }
}
