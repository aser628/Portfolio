document.querySelectorAll(".category-card").forEach(card => {
  card.addEventListener("click", () => {
    const category = card.dataset.category;

    document.querySelectorAll(".product-card").forEach(product => {
      product.style.display =
        product.dataset.category === category ? "block" : "none";
    });
  });
});
