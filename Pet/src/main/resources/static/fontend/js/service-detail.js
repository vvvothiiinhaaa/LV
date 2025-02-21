function changeImage(card, newSrc) {
    let img = card.querySelector("img");
    img.src = newSrc;
  }

  function resetImage(card, originalSrc) {
    let img = card.querySelector("img");
    img.src = originalSrc;
  }