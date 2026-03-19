// Bouton minimiser
document.getElementById("minimizeBtn").addEventListener("click", async () => {
  const response = await window.versions.minimize()
  console.log(response)
});

// Bouton maximiser/restaurer
document.getElementById("maximizeBtn").addEventListener("click", async () => {
    const response = await window.versions.maximize()
  console.log(response)
});

// Bouton fermer
document.getElementById("closeBtn").addEventListener("click", async () => {
    const response = await window.versions.close()
  console.log(response)
});

// Navigation
document.querySelectorAll(".nav-btn").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    document
      .querySelectorAll(".nav-btn")
      .forEach((b) => b.classList.remove("active"));
    e.target.classList.add("active");
  });
});

