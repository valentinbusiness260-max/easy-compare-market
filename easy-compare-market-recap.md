# Easy Compare Market — Récapitulatif du projet

## Concept
Un SaaS (app mobile + web) par abonnement qui compare en temps réel les prix d'un même produit chez plusieurs marketplaces, et redirige l'utilisateur vers le site marchand le moins cher pour commander.

## Marché de lancement
- **Zone géographique** : Émirats Arabes Unis
- **Catégorie de départ** : eau en bouteille (cartons de 12x500ml, 6x1.5L, etc.)
- **Marques prioritaires** : Al Ain, Masafi, Mai Dubai, Arwa, Oasis, Al Reem
- **Expansion prévue** : autres catégories de courses du quotidien, une fois le concept validé

## Retailers comparés
| Retailer | Accès aux prix |
|---|---|
| Amazon.ae | Programme d'affiliation officiel (Amazon Associates + PA API) |
| Carrefour UAE | Programme d'affiliation via réseau (ex: DCMnetwork) |
| Lulu Hypermarket | Pas de programme d'affiliation trouvé — mise à jour manuelle au départ, ou partenariat direct à négocier |

## Modèle économique
- **Abonnement mensuel récurrent** (paiement automatique chaque mois)
- **+ commission d'affiliation** sur chaque commande passée via le lien de redirection
- **Essai gratuit de 7 jours** avant le premier prélèvement (carte/moyen de paiement demandé dès l'inscription, comme Netflix)

## Parcours utilisateur
1. L'utilisateur s'inscrit et démarre son essai gratuit
2. Il recherche un produit par **texte**, **scan de code-barres**, ou **navigation par catégorie**
3. L'app affiche les prix des 3 retailers, avec le moins cher mis en avant
4. L'utilisateur clique sur "Commander" → redirigé vers le site du retailer via un lien affilié
5. Après 7 jours, l'abonnement mensuel démarre automatiquement (sauf annulation)

## Moyens de paiement prévus
| Moyen | Statut |
|---|---|
| Carte bancaire (Visa/Mastercard) | À intégrer en priorité |
| Apple Pay / Google Pay | À intégrer en priorité |
| Botim (ex-PayBy) | À intégrer — supporte les abonnements récurrents |
| PayPal | Possible, utile surtout pour audience internationale |
| Tabby (BNPL) | À réserver pour de futurs achats ponctuels (non adapté à l'abonnement récurrent) |
| Crédit SIM (du / Etisalat) | À vérifier directement avec les opérateurs — pas de confirmation que ça couvre les abonnements tiers |

## Stack technique envisagée (sans code)
- **Base de données produits/prix** : Airtable (table Produits + table Prix liée)
- **App mobile/web** : Bubble ou Glide + Softr
- **Automatisation de la récupération des prix** : Make.com (connecté à l'API Amazon et aux flux Carrefour)
- **Lulu** : mise à jour manuelle en attendant un partenariat

## Prochaines étapes possibles
- Configurer l'accès à l'API Amazon dans Make.com
- Finaliser l'écran d'accueil de l'app
- Étudier les frais et l'intégration de chaque moyen de paiement (passerelle type Telr, PayTabs, ou Stripe)
- Tester le concept avec un petit groupe d'utilisateurs sur la catégorie eau avant d'élargir
