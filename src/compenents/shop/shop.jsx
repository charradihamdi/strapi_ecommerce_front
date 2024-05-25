import React, { useState } from 'react';

function Shop() {
  // État pour stocker le nombre d'articles dans le panier
  const [cartCount, setCartCount] = useState(0);

  // Fonction pour incrémenter le nombre d'articles dans le panier
  const incrementCartCount = () => {
    setCartCount(prevCount => prevCount + 1);
  };

  return (
    <div>
      {/* Bouton "buy now" qui incrémente le panier lorsqu'il est cliqué */}
      <button onClick={incrementCartCount}>Buy Now</button>

      {/* Afficher le nombre d'articles dans le panier */}
      <p>Cart Total: {cartCount}</p>
    </div>
  );
}

export default Shop;
