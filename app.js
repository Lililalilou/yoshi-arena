$(function() {
  var Joueur = {
    joueurs: [
      {
        nom: 'Premier joueur',
        visuel: 'joueur1'
      },
      {
        nom: 'Deuxième joueur',
        visuel: 'joueur2'
      }
    ],
    init: function(id, grille) {
      this.sante = 100;
      this.force = 10;
      this.id = id;
      this.grille = grille;
      this.arme = null;
      return this;
    },
    attribuerArme: function(arme) {
      this.arme = arme;
    },
    attribuerCase: function(element) {
      this.case = element;
      this.case.attribuerJoueur(this);
    },
    deplacerDroite: function(element, grille) {
      this.case = element;
      var nextCase = null;
      if (this.grille.ifExiste(this.case.x + 1, this.case.y)) {
        nextCase = this.grille.map[this.case.x + 1][this.case.y];
        if (nextCase.deplacementOk()) {
          this.case.supprimerJoueur(this);
          this.case = nextCase;
          this.case.attribuerJoueur(this);
          //si arme sur la case => échange armes
          //var loot = this.grille.obtenirArme(this.case.x, this.case.y);
          if (this.case.arme) {
            console.log("Le joueur prend l'arme");
            this.arme = this.case.echangerArme(this.arme);
            console.log(this);
          }
          //si case adj = joueur => combat
          var adversaire = this.grille.obtenirJoueurAdj(this.case.x, this.case.y);
          if (adversaire) {
            this.combattre();
          } else {
            console.log("Pas de combat");
          }
        } else {
          console.log('Déplacement impossible');
        }
      }
    },
    deplacerGauche: function(element, grille) {
      this.case = element;
      var nextCase = null;
      if (this.grille.ifExiste(this.case.x - 1, this.case.y)) {
        nextCase = this.grille.map[this.case.x - 1][this.case.y];
        if (nextCase.deplacementOk()) {
          this.case.supprimerJoueur(this);
          this.case = nextCase;
          this.case.attribuerJoueur(this);
        } else {
          console.log('Déplacement impossible');
        }
      }
    },
    deplacerBas: function(element, grille) {
      this.case = element;
      var nextCase = null;
      if (this.grille.ifExiste(this.case.x, this.case.y + 1)) {
        nextCase = this.grille.map[this.case.x][this.case.y + 1];
        if (nextCase.deplacementOk()) {
          this.case.supprimerJoueur(this);
          this.case = nextCase;
          this.case.attribuerJoueur(this);
        } else {
          console.log('Déplacement impossible');
        }
      }
    },
    deplacerHaut: function(element, grille) {
      this.case = element;
      var nextCase = null;
      if (this.grille.ifExiste(this.case.x, this.case.y - 1)) {
        nextCase = this.grille.map[this.case.x][this.case.y - 1];
        if (nextCase.deplacementOk()) {
          this.case.supprimerJoueur(this);
          this.case = nextCase;
          this.case.attribuerJoueur(this);
        } else {
          console.log('Déplacement impossible');
        }
      }
    },
    combattre: function() {
      console.log("Combat");
    },
    obtenirSelection: function() {
        return this.joueurs[this.id]; // retour de {x nom et x visuel}
    },
    obtenirVisuel: function() {
      return this.obtenirSelection().visuel;
    },
  }

  var Arme = {
    types: [
      {
        nom: 'baton',
        visuel: 'arme0',
        degats: 10
      },
      {
        nom: 'marteau',
        visuel: 'arme1',
        degats: 20
      },
      {
        nom: 'massue',
        visuel: 'arme2',
        degats: 30
      },
      {
        nom: 'épée',
        visuel: 'arme3',
        degats: 40
      },
      {
        nom: 'arbalète',
        visuel: 'arme4',
        degats: 50
      }
    ],
    init: function(typeId) {
      if (typeId === 0) {
        this.typeId = typeId;
      } else {
        this.typeId = Math.floor(Math.random() * (this.types.length - 1)) + 1;
      }
    },
    obtenirSelection: function() {
      return this.types[this.typeId];
    },
    attribuerCase: function(element) {
      this.case = element;
      this.case.attribuerArme(this);
    },
    obtenirNom: function() {
      return this.obtenirSelection().nom;
    },
    obtenirDegats: function() {
      return this.obtenirSelection().degats;
    },
    obtenirVisuel: function() {
      return this.obtenirSelection().visuel;
    }
  }

  var Tuile = {
    init: function(x, y) {
      this.x = x;
      this.y = y;
      this.posX = `${this.x * 50}px`;
      this.posY = `${this.y * 50}px`;
      this.isObstacle = false;
      this.joueur = null;
      this.arme = null;
      return this;
    },
    creer: function() {
      this.htmlCell = document.createElement('div');
      //this.htmlCell = $('<div />');
      this.htmlCell.className = 'tuile';
      this.htmlCell.style.top = this.posY;
      this.htmlCell.style.left = this.posX;
    },
    checkLibre: function() {
       return !this.isObstacle && !this.joueur && !this.arme;
    },
    deplacementOk: function() {
       return !this.isObstacle && !this.joueur;
    },
    rendreBloquant: function() {
      this.htmlCell.className += ' obstacle';
      this.isObstacle = true;
    },
    attribuerJoueur: function(joueur) {
      this.joueur = joueur;
      $(this.htmlCell).addClass(this.joueur.obtenirVisuel());
    },
    supprimerJoueur: function() {
      $(this.htmlCell).removeClass(this.joueur.obtenirVisuel());
      this.joueur = null;
    },
    attribuerArme: function(arme) {
      this.arme = arme;
      $(this.htmlCell).addClass(this.arme.obtenirVisuel());
    },
    echangerArme: function(arme) {
      console.log("Echange arme");
      var armeActuelle = this.arme; // arme sur la case
      $(this.htmlCell).removeClass(armeActuelle.obtenirVisuel());//visuel absent
      $(this.htmlCell).addClass(this.joueur.arme.obtenirVisuel());//visuel de case devient celui de l'arme du J
      this.arme = arme;//attribut de l'arme lootée devient arme du joueur
      return armeActuelle;
    }
  }

  var Grille = {
    init: function(largeur, hauteur) {
      this.hauteur = hauteur;
      this.largeur = largeur;
      this.map = [];
      this.joueurs = [];
      this.armes = [];
      return this;
    },
    afficher: function() {
      this.htmlGrid = document.createElement('div');
      this.htmlGrid.setAttribute('class', 'grille');
      $('section').append(this.htmlGrid);
    },
    genererMap: function() {
      for (let x = 0; x < this.largeur; x += 1) {
        var col = [];
        for (let y = 0; y < this.hauteur; y += 1) {
          var tuile = Object.create(Tuile);
          tuile.init(x, y).creer();
          this.htmlGrid.append(tuile.htmlCell);
          col.push(tuile);
        }
        this.map.push(col);
      }
    },
    ifExiste: function(x, y) {
      if (x >= 0 && y >= 0 && x < this.largeur && y < this.hauteur) {
        return true;
      }
      return false;
    },
    obtenirCaseDispo: function(x, y) {
      if (this.ifExiste(x, y)) {
        return this.map[x][y];
      }
      return null;
    },
    obtenirJoueurAdj: function(x, y) {
      if (this.obtenirCaseDispo(x + 1, y) && this.obtenirCaseDispo(x + 1, y).joueur) {
        return this.obtenirCaseDispo(x + 1, y).joueur;
      }
      if (this.obtenirCaseDispo(x - 1, y) && this.obtenirCaseDispo(x - 1, y).joueur) {
        return this.obtenirCaseDispo(x - 1, y).joueur;
      }
      if (this.obtenirCaseDispo(x, y + 1) && this.obtenirCaseDispo(x, y + 1).joueur) {
        return this.obtenirCaseDispo(x, y + 1).joueur;
      }
      if (this.obtenirCaseDispo(x, y - 1) && this.obtenirCaseDispo(x, y - 1).joueur) {
        return this.obtenirCaseDispo(x, y - 1).joueur;
      }
      return null;
    },
    obtenirArme: function(x, y) {
      if (this.obtenirCaseDispo(x, y).arme) {
        return this.obtenirCaseDispo(x, y).arme;
      }
    },
    obtenirCaseAleatoire: function(typeJoueur) {
      var randomX = Math.floor(Math.random() * this.largeur);
      var randomY = Math.floor(Math.random() * this.hauteur);
      var random = this.map[randomX][randomY];
      if (random.checkLibre()) {
        if (typeJoueur) {//si joueur, on vérifie que les cases adjacentes ne sont pas occupées par un joueur
          if (
            (this.map[randomX + 1] ? !this.map[randomX + 1][randomY].joueur : true)
            && (this.map[randomX - 1] ? !this.map[randomX - 1][randomY].joueur : true)
            && (this.map[randomX][randomY + 1] ? !this.map[randomX][randomY + 1].joueur : true)
            && (this.map[randomX][randomY - 1] ? !this.map[randomX][randomY - 1].joueur : true)
          ) {
            return random;
          }
          return this.obtenirCaseAleatoire(typeJoueur);
        }
        return random;
      }
      return this.obtenirCaseAleatoire(typeJoueur);
    },
    genererObstacles: function(nombre) {
      for (let i = 0; i < nombre ; i += 1) {
        this.obtenirCaseAleatoire().rendreBloquant();
      }
    },
    genererArmes: function() {
      var random = Math.ceil((Math.random() * 4) - 1);
      for (let i = 0; i <= random ; i += 1) {
        var arme = Object.create(Arme);
        arme.init();
        arme.attribuerCase(this.obtenirCaseAleatoire());
        this.armes.push(arme);
      }
    },
    genererJoueurs: function(nombre) {
      for (let i = 0; i < nombre; i += 1) {
        var joueur = Object.create(Joueur);
        joueur.init(i, this);
        joueur.attribuerCase(this.obtenirCaseAleatoire(true));
        this.joueurs.push(joueur); // tableau dans init grille
        var arme = Object.create(Arme);
        arme.init(0);
        joueur.attribuerArme(arme);
        console.log(arme);
      }
    }
  }

  var grille = Object.create(Grille);
  grille.init(10, 10).afficher();
  grille.genererMap();
  grille.genererObstacles(10);
  grille.genererArmes();
  grille.genererJoueurs(2);
  //grille.joueurs[0].deplacerDroite(grille.joueurs[0].case);

  // Gestion du clavier
  window.onkeydown = function(event) {
    var e = event || window.event;
    var key = e.which || e.keyCode;
    switch(key) {
  	case 38 : case 122 : case 119 : case 90 : case 87 : // Flèche haut, z, w, Z, W
  		grille.joueurs[0].deplacerHaut(grille.joueurs[0].case);
  		break;
  	case 40 : case 115 : case 83 : // Flèche bas, s, S
  		grille.joueurs[0].deplacerBas(grille.joueurs[0].case);
  		break;
  	case 37 : case 113 : case 97 : case 81 : case 65 : // Flèche gauche, q, a, Q, A
  		grille.joueurs[0].deplacerGauche(grille.joueurs[0].case);
  		break;
  	case 39 : case 100 : case 68 : // Flèche droite, d, D
  		grille.joueurs[0].deplacerDroite(grille.joueurs[0].case);
  		break;
  	default :
  		// Si la touche ne nous sert pas, nous n'avons aucune raison de bloquer son comportement normal.
  		return true;
  }


  }

});
