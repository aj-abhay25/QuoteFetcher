document.addEventListener("DOMContentLoaded", () => {
    const savedQuotesContainer = document.getElementById("savedQuotesContainer");
    const noQuotesMessage = document.getElementById("noQuotesMessage");
  
    chrome.storage.local.get({ savedQuotes: [] }, (result) => {
      const savedQuotes = result.savedQuotes;
  
      if (savedQuotes.length > 0) {
        noQuotesMessage.style.display = "none";
        savedQuotes.forEach((quoteObj, index) => {
          const quoteElement = document.createElement("div");
          quoteElement.classList.add("saved-quote");
          quoteElement.innerHTML = `
            <p>"${quoteObj.quote}"</p>
            <p class="author">- ${quoteObj.author}</p>
            <div class="quote-actions">
              <button class="copyQuote" data-index="${index}">Copy</button>
              <button class="deleteQuote" data-index="${index}">Delete</button>
              <button class="shareQuote" data-index="${index}">Share</button>
            </div>
          `;
          savedQuotesContainer.appendChild(quoteElement);
        });
  
        const copyButtons = document.querySelectorAll(".copyQuote");
        const deleteButtons = document.querySelectorAll(".deleteQuote");
        const shareButtons = document.querySelectorAll(".shareQuote");
  
        copyButtons.forEach((button) => {
          button.addEventListener("click", (e) => {
            const index = e.target.getAttribute("data-index");
            const quoteToCopy = savedQuotes[index];
            navigator.clipboard.writeText(`"${quoteToCopy.quote}" - ${quoteToCopy.author}`)
              .then(() => alert("Quote copied to clipboard!"));
          });
        });
  
        deleteButtons.forEach((button) => {
          button.addEventListener("click", (e) => {
            const index = e.target.getAttribute("data-index");
            savedQuotes.splice(index, 1);
            chrome.storage.local.set({ savedQuotes }, () => {
              savedQuotesContainer.innerHTML = "";
              noQuotesMessage.style.display = "block";
              savedQuotes.forEach((quoteObj, index) => {
                const quoteElement = document.createElement("div");
                quoteElement.classList.add("saved-quote");
                quoteElement.innerHTML = `
                  <p>"${quoteObj.quote}"</p>
                  <p class="author">- ${quoteObj.author}</p>
                  <div class="quote-actions">
                    <button class="copyQuote" data-index="${index}">Copy</button>
                    <button class="deleteQuote" data-index="${index}">Delete</button>
                    <button class="shareQuote" data-index="${index}">Share</button>
                  </div>
                `;
                savedQuotesContainer.appendChild(quoteElement);
              });
            });
          });
        });
  
        shareButtons.forEach((button) => {
          button.addEventListener("click", (e) => {
            const index = e.target.getAttribute("data-index");
            const quoteToShare = savedQuotes[index];
            if (navigator.share) {
              navigator.share({ text: `"${quoteToShare.quote}" - ${quoteToShare.author}` })
                .catch(console.error);
            } else {
              alert("Share API not supported.");
            }
          });
        });
      } else {
        noQuotesMessage.style.display = "block";
      }
    });
  
    document.getElementById("deleteAll").addEventListener("click", () => {
      chrome.storage.local.set({ savedQuotes: [] }, () => {
        savedQuotesContainer.innerHTML = "";
        noQuotesMessage.style.display = "block";
      });
    });
  
    document.getElementById("copyAll").addEventListener("click", () => {
      chrome.storage.local.get({ savedQuotes: [] }, (result) => {
        const savedQuotes = result.savedQuotes;
        let allQuotes = "";
        savedQuotes.forEach((quoteObj) => {
          allQuotes += `"${quoteObj.quote}" - ${quoteObj.author}\n`;
        });
        navigator.clipboard.writeText(allQuotes).then(() => {
          alert("All quotes copied to clipboard!");
        });
      });
    });
  
    document.getElementById("shareAll").addEventListener("click", () => {
      chrome.storage.local.get({ savedQuotes: [] }, (result) => {
        const savedQuotes = result.savedQuotes;
        let allQuotes = "";
        savedQuotes.forEach((quoteObj) => {
          allQuotes += `"${quoteObj.quote}" - ${quoteObj.author}\n`;
        });
        if (navigator.share) {
          navigator.share({ text: allQuotes }).catch(console.error);
        } else {
          alert("Share API not supported.");
        }
      });
    });
  });