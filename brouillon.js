$(function() {
  var Tuile = {
    init: function (x, y) {
      this.posX = `${x * 50}px`;
      this.posY = `${y * 50}px`;
      return this;
    },
    creer: function () {
      this.htmlCell = document.createElement('div');
      this.htmlCell.className = 'tuile';
      this.htmlCell.style.top = this.posX;
      this.htmlCell.style.left = this.posY;
    }
  }

  var Grille = {
    init: function (hauteur, largeur) {
      this.hauteur = hauteur;
      this.largeur = largeur;
      this.map = [];
      return this;
    },
    afficher: function () {
      this.htmlGrid = document.createElement('div');
      this.htmlGrid.setAttribute('class', 'grille');
      $('body').append(this.htmlGrid);
    },
    genererMap: function () {
      for (let y = 0; y < this.largeur; y += 1) {
        var col = [];
        for (let x = 0; x < this.hauteur; x += 1) {
          var tuile = Object.create(Tuile);
          tuile.init(x, y).creer();
          this.htmlGrid.append(tuile.htmlCell);
          col.push(tuile);
        }
        this.map.push(col);
      }
    }
  }
  var grille = Object.create(Grille);
  grille.init(12, 12).afficher();
  grille.genererMap();



});
