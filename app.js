$(function() {
  var Tuile = {
    init: function(x, y) {
      this.posX = `${x * 50}px`;
      this.posY = `${y * 50}px`;
      this.isObstacle = false;
      return this;
    },
    creer: function() {
      this.htmlCell = document.createElement('div');
      //this.htmlCell = $('<div />');
      this.htmlCell.className = 'tuile';
      this.htmlCell.style.top = this.posY;
      this.htmlCell.style.left = this.posX;
    },
    rendreBloquant: function() {
      this.htmlCell.className += ' obstacle';
      this.isObstacle = true;
    }
  }

  var Grille = {
    init: function(largeur, hauteur) {
      this.hauteur = hauteur;
      this.largeur = largeur;
      this.map = [];
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
    obtenirCaseAleatoire: function() {
      var randomX = Math.floor(Math.random() * this.largeur);
      var randomY = Math.floor(Math.random() * this.hauteur);
      var random = this.map[randomX][randomY];
      if (random.isObstacle === false) {
        return random;
      } else {
        return this.obtenirCaseAleatoire();
      }
    },
    genererObstacles: function(nombre) {
      for (let i = 0; i < nombre ; i += 1) {
        this.obtenirCaseAleatoire().rendreBloquant();
      }
    }
  }


  var grille = Object.create(Grille);
  grille.init(10, 10).afficher();
  grille.genererMap();
  grille.genererObstacles(10);

});
