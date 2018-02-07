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
    init: function(id) {
      this.sante = 100;
      this.force = 10;
      this.id = id;
      return this;
    },
    attribuerCase: function(element) {
      this.case = element;
      this.case.attribuerJoueur(this);
    },
    desattribuerCase: function(element) {
      this.case = element;
      this.case.supprimerJoueur(this);
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
    init: function() {
      this.typeId = Math.floor(Math.random() * this.types.length);
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
      this.isJoueur = false;
      this.isArme = false;
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
       return !this.isObstacle && !this.isJoueur && !this.isArme;
    },
    rendreBloquant: function() {
      this.htmlCell.className += ' obstacle';
      this.isObstacle = true;
    },
    attribuerJoueur: function(joueur) {
      this.isJoueur = true;
      this.htmlCell.className += ` ${joueur.obtenirVisuel()}`;
    },
    supprimerJoueur: function(joueur) {
      this.isJoueur = false;
      $(this.htmlCell).removeClass(` ${joueur.obtenirVisuel()}`);
    },
    attribuerArme: function(arme) {
      this.isArme = true;
      this.htmlCell.className += ` ${arme.obtenirVisuel()}`;
    }
  }

  var Grille = {
    init: function(largeur, hauteur) {
      this.hauteur = hauteur;
      this.largeur = largeur;
      this.map = [];
      this.joueurs = [];
      return this;
    },
    afficher: function() {
      this.htmlGrid = document.createElement('div');
      this.htmlGrid.setAttribute('class', 'grille');
      $('body').append(this.htmlGrid);
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
    obtenirCaseAleatoire: function(typeJoueur) {
      console.log('obtenirCaseAleatoire');
      var randomX = Math.floor(Math.random() * this.largeur);
      var randomY = Math.floor(Math.random() * this.hauteur);
      var random = this.map[randomX][randomY];
      if (random.checkLibre()) {
        if (typeJoueur) {
          console.log(randomX,randomY);
          if (
            (this.map[randomX + 1] ? !this.map[randomX + 1][randomY].isJoueur : true)
            && (this.map[randomX - 1] ? !this.map[randomX - 1][randomY].isJoueur : true)
            && (this.map[randomX][randomY + 1] ? !this.map[randomX][randomY + 1].isJoueur : true)
            && (this.map[randomX][randomY - 1] ? !this.map[randomX][randomY - 1].isJoueur : true)
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
      }
    },
    genererJoueurs: function(nombre) {
      for (let i = 0; i < nombre; i += 1) {
        console.log(`Joueur ${i}`)
        var joueur = Object.create(Joueur);
        joueur.init(i);
        joueur.attribuerCase(this.obtenirCaseAleatoire(true));

        console.log(joueur.case);
        this.joueurs.push(joueur); // tableau dans init grille
        console.log(this.joueurs);
      }
    }
  }

  var grille = Object.create(Grille);
  grille.init(10, 10).afficher();
  grille.genererMap();
  grille.genererObstacles(10);
  grille.genererArmes();
  grille.genererJoueurs(2);
  grille.joueurs[0].desattribuerCase(grille.joueurs[0].case);
});
