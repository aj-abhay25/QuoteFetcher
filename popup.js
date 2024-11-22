let currentQuote = "";
let currentAuthor = "";

function fetchQuote() {
  const apiKey = "uINFU/Fp7JPR0G77SvAtPQ==9wOX6YWj5Jpad47r";
  const category = document.getElementById("categorySelect").value;
  const url = `https://api.api-ninjas.com/v1/quotes?category=${category}`;

  fetch(url, { headers: { "X-Api-Key": apiKey } })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      if (data && data.length > 0) {
        const quoteData = data[0];
        currentQuote = quoteData.quote;
        currentAuthor = quoteData.author;
        document.getElementById("quoteContainer").innerHTML = `
          <p class="quote">"${currentQuote}"</p>
          <p class="author">- ${currentAuthor}</p>
        `;
      } else {
        document.getElementById("quoteContainer").textContent = "No quotes available.";
      }
    })
    .catch(error => {
      console.error("Error fetching quote:", error);
      document.getElementById("quoteContainer").textContent = "Failed to load quote. Please try again.";
    });
}

function shareQuote() {
  if (navigator.share) {
    navigator.share({ text: `"${currentQuote}" - ${currentAuthor}` }).catch(console.error);
  } else {
    alert("Share API not supported.");
  }
}

document.getElementById("fetchQuote").addEventListener("click", fetchQuote);
document.getElementById("shareQuote").addEventListener("click", shareQuote);
document.getElementById("copyQuote").addEventListener("click", () => {
  navigator.clipboard.writeText(`"${currentQuote}" - ${currentAuthor}`).then(() => alert("Quote copied to clipboard!"));
});
document.getElementById("saveQuote").addEventListener("click", () => {
  if (currentQuote && currentAuthor) {
    chrome.storage.local.get({ savedQuotes: [] }, (result) => {
      const savedQuotes = result.savedQuotes;
      savedQuotes.push({ quote: currentQuote, author: currentAuthor });
      chrome.storage.local.set({ savedQuotes }, () => alert("Quote saved!"));
    });
  } else {
    alert("No quote to save.");
  }
});

document.addEventListener("DOMContentLoaded", fetchQuote);