import React, { useState, useEffect } from 'react';
import './ListProduits.css';

const ListProduits = () => {
  const [produits, setProduits] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [erreur, setErreur] = useState('');
  const [filtreCategorie, setFiltreCategorie] = useState('Toutes');
  const [filtreMarque, setFiltreMarque] = useState('Toutes');
  const [ordreTri, setOrdreTri] = useState('dateDesc');
  
  // Récupérer les catégories uniques depuis les produits
  const categories = ['Toutes', ...new Set(produits.map(p => p.categorie))];
  
  // Récupérer les marques uniques depuis les produits
  const marques = ['Toutes', ...new Set(produits.map(p => p.marque))];
  
  useEffect(() => {
    chargerProduits();
  }, []);
  
  const chargerProduits = async () => {
    setIsLoading(true);
    try {
      // Remplacez cette URL par celle de votre API backend
      const response = await fetch('http://localhost:5000/api/produits');
      
      if (response.ok) {
        const data = await response.json();
        setProduits(data.produits || []);
        setErreur('');
      } else {
        setErreur('Erreur lors du chargement des produits');
      }
    } catch (error) {
      console.error('Erreur:', error);
      setErreur('Erreur de connexion au serveur');
      // Données de démonstration pour le développement
      setProduits(produitsDemonstration);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Fonction pour ajouter un produit à la liste (appelée depuis Produit.jsx)
  const ajouterProduit = (nouveauProduit) => {
    setProduits([nouveauProduit, ...produits]);
  };
  
  // Filtrer et trier les produits
  const produitsFiltres = produits
    .filter(produit => {
      if (filtreCategorie !== 'Toutes' && produit.categorie !== filtreCategorie) {
        return false;
      }
      if (filtreMarque !== 'Toutes' && produit.marque !== filtreMarque) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      switch (ordreTri) {
        case 'nomAsc':
          return a.nom.localeCompare(b.nom);
        case 'nomDesc':
          return b.nom.localeCompare(a.nom);
        case 'quantiteAsc':
          return a.quantite - b.quantite;
        case 'quantiteDesc':
          return b.quantite - a.quantite;
        case 'dateAsc':
          return new Date(a.dateAjout) - new Date(b.dateAjout);
        case 'dateDesc':
        default:
          return new Date(b.dateAjout) - new Date(a.dateAjout);
      }
    });
  
  const formaterDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Données de démonstration (à supprimer en production)
  const produitsDemonstration = [
    {
      id: 1,
      nom: 'iPhone 13 Pro',
      image: 'https://via.placeholder.com/100',
      marque: 'Apple',
      categorie: 'Électronique',
      quantite: 15,
      dateAjout: '2023-10-15T10:30:00Z'
    },
    {
      id: 2,
      nom: 'Air Max 270',
      image: 'https://via.placeholder.com/100',
      marque: 'Nike',
      categorie: 'Sport',
      quantite: 42,
      dateAjout: '2023-10-10T14:20:00Z'
    },
    {
      id: 3,
      nom: 'PlayStation 5',
      image: 'https://via.placeholder.com/100',
      marque: 'Sony',
      categorie: 'Électronique',
      quantite: 8,
      dateAjout: '2023-10-05T09:15:00Z'
    },
    {
      id: 4,
      nom: 'Galaxy S21',
      image: 'https://via.placeholder.com/100',
      marque: 'Samsung',
      categorie: 'Électronique',
      quantite: 25,
      dateAjout: '2023-09-28T16:45:00Z'
    },
    {
      id: 5,
      nom: 'MacBook Air',
      image: 'https://via.placeholder.com/100',
      marque: 'Apple',
      categorie: 'Électronique',
      quantite: 12,
      dateAjout: '2023-09-20T11:10:00Z'
    }
  ];
  
  return (
    <div className="liste-produits-container">
      <h2 className="liste-title">Liste des produits</h2>
      
      <div className="filtres-container">
        <div className="filtre-group">
          <label htmlFor="filtre-categorie" className="filtre-label">
            Filtrer par catégorie:
          </label>
          <select
            id="filtre-categorie"
            value={filtreCategorie}
            onChange={(e) => setFiltreCategorie(e.target.value)}
            className="filtre-select"
          >
            {categories.map((categorie, index) => (
              <option key={index} value={categorie}>
                {categorie}
              </option>
            ))}
          </select>
        </div>
        
        <div className="filtre-group">
          <label htmlFor="filtre-marque" className="filtre-label">
            Filtrer par marque:
          </label>
          <select
            id="filtre-marque"
            value={filtreMarque}
            onChange={(e) => setFiltreMarque(e.target.value)}
            className="filtre-select"
          >
            {marques.map((marque, index) => (
              <option key={index} value={marque}>
                {marque}
              </option>
            ))}
          </select>
        </div>
        
        <div className="filtre-group">
          <label htmlFor="ordre-tri" className="filtre-label">
            Trier par:
          </label>
          <select
            id="ordre-tri"
            value={ordreTri}
            onChange={(e) => setOrdreTri(e.target.value)}
            className="filtre-select"
          >
            <option value="dateDesc">Date (plus récent)</option>
            <option value="dateAsc">Date (plus ancien)</option>
            <option value="nomAsc">Nom (A-Z)</option>
            <option value="nomDesc">Nom (Z-A)</option>
            <option value="quantiteAsc">Quantité (croissant)</option>
            <option value="quantiteDesc">Quantité (décroissant)</option>
          </select>
        </div>
        
        <button onClick={chargerProduits} className="refresh-button">
          Actualiser
        </button>
      </div>
      
      {isLoading ? (
        <div className="loading">Chargement des produits...</div>
      ) : erreur ? (
        <div className="erreur">
          {erreur}
          <button onClick={chargerProduits} className="retry-button">
            Réessayer
          </button>
        </div>
      ) : produitsFiltres.length === 0 ? (
        <div className="aucun-produit">
          {produits.length === 0 
            ? 'Aucun produit enregistré. Ajoutez votre premier produit!' 
            : 'Aucun produit ne correspond aux filtres sélectionnés.'}
        </div>
      ) : (
        <div className="produits-grid">
          {produitsFiltres.map((produit) => (
            <div key={produit.id} className="produit-card">
              <div className="card-image-container">
                <img 
                  src={produit.image} 
                  alt={produit.nom}
                  className="card-image"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/150';
                  }}
                />
              </div>
              
              <div className="card-content">
                <h3 className="card-title">{produit.nom}</h3>
                
                <div className="card-details">
                  <div className="card-detail">
                    <span className="detail-label">Marque:</span>
                    <span className="detail-value">{produit.marque}</span>
                  </div>
                  
                  <div className="card-detail">
                    <span className="detail-label">Catégorie:</span>
                    <span className="detail-value">{produit.categorie}</span>
                  </div>
                  
                  <div className="card-detail">
                    <span className="detail-label">Quantité:</span>
                    <span className={`detail-value quantite ${produit.quantite < 10 ? 'faible' : ''}`}>
                      {produit.quantite} {produit.quantite === 1 ? 'unité' : 'unités'}
                    </span>
                  </div>
                  
                  <div className="card-detail">
                    <span className="detail-label">Ajouté le:</span>
                    <span className="detail-value">{formaterDate(produit.dateAjout)}</span>
                  </div>
                </div>
              </div>
              
              <div className="card-actions">
                <button className="action-button edit">Modifier</button>
                <button className="action-button delete">Supprimer</button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="stats">
        <div className="stat">
          <span className="stat-label">Total des produits:</span>
          <span className="stat-value">{produits.length}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Produits filtrés:</span>
          <span className="stat-value">{produitsFiltres.length}</span>
        </div>
      </div>
    </div>
  );
};

export default ListProduits;