document.addEventListener("DOMContentLoaded", () => {
  const generateBtn = document.getElementById("generateBtn");
  const promptInput = document.getElementById("promptInput");
  const outputText = document.getElementById("outputText");
  const copyBtn = document.getElementById("copyBtn");

  // 👇 async function
  generateBtn.addEventListener("click", async () => {
    const prompt = promptInput.value.trim();

    if (prompt === "") {
      outputText.innerText = "⚠️ Please enter a prompt before generating!";
      outputText.style.color = "#FFD700";
      return;
    }

    outputText.style.color = "#EAEAEA";
    // show spinner + message until response replaces it
    if (!document.getElementById("email-spinner-style")) {
      const s = document.createElement("style");
      s.id = "email-spinner-style";
      s.innerHTML = `
      .email-spinner { display:inline-block; width:16px; height:16px;
               border:2px solid rgba(255,255,255,0.2);
               border-top-color:#EAEAEA; border-radius:50%;
               animation:spin 1s linear infinite; margin-right:8px;
               vertical-align:middle; }
      @keyframes spin { to { transform: rotate(360deg); } }
      `;
      document.head.appendChild(s);
    }
    outputText.innerHTML =
      '<span class="email-spinner" aria-hidden="true"></span><span>✉️ Generating your email...</span>';
    outputText.classList.add("loading");

    // disable inputs and style button
    generateBtn.disabled = true;
    promptInput.disabled = true;
    generateBtn.dataset.prevBg = generateBtn.style.backgroundColor || "";
    generateBtn.dataset.prevCursor = generateBtn.style.cursor || "";
    generateBtn.style.backgroundColor = "#FFD700";
    generateBtn.style.cursor = "not-allowed";

    // re-enable when spinner/loading class is removed
    const observer = new MutationObserver((mutationsList) => {
      for (const m of mutationsList) {
        if (m.type === "attributes" && m.attributeName === "class") {
          if (!outputText.classList.contains("loading")) {
            generateBtn.disabled = false;
            promptInput.disabled = false;
            generateBtn.style.backgroundColor = generateBtn.dataset.prevBg;
            generateBtn.style.cursor = generateBtn.dataset.prevCursor;
            delete generateBtn.dataset.prevBg;
            delete generateBtn.dataset.prevCursor;
            observer.disconnect();
            break;
          }
        }
      }
    });
    observer.observe(outputText, { attributes: true, attributeFilter: ["class"] });

    // 📨 Fetch request to backend
    try {
      // 🔗 Connect to local backend API
      const API_URL = "https://mail-karo.onrender.com/api/generate-email";
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate email");
      }

      if (data.success && data.email) {
        outputText.classList.remove("loading");
        outputText.style.color = "#EAEAEA";
        outputText.innerText = data.email;
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (err) {
      outputText.classList.remove("loading");
      outputText.innerText = `⚠️ Error: ${
        err.message || "Failed to generate email. Please try again."
      }`;
      outputText.style.color = "#FF6B6B";
      console.error("❌ Fetch Error:", err);
    }
  });

  // 📋 Copy button
  copyBtn.addEventListener("click", () => {
    navigator.clipboard.writeText(outputText.innerText);
    copyBtn.innerText = "Copied!";
    setTimeout(() => (copyBtn.innerText = "Copy"), 1500);
  });
});

// ✨ Loading animation
const promptStyle = document.createElement("style");
promptStyle.innerHTML = `
.loading { animation: blink 0.8s infinite; }
@keyframes blink { 0%,100%{opacity:.5;} 50%{opacity:1;} }
`;
document.head.appendChild(promptStyle);
