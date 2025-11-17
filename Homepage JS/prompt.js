document.addEventListener("DOMContentLoaded", () => {
  const generateBtn = document.getElementById("generateBtn");
  const promptInput = document.getElementById("promptInput");
  const outputText = document.getElementById("outputText");

  const copyBtn = document.getElementById("copyBtn");
  const resetBtn = document.getElementById("resetBtn");
  const regenerateBtn = document.getElementById("regenerateBtn");

  let lastPrompt = ""; // ⭐ Store last used prompt for Regenerate

  // ⭐ Set initial button state
  generateBtn.innerText = "⚡ Generate";

  // ⭐ Reset Generate button when user types
  promptInput.addEventListener("input", () => {
    generateBtn.innerText = "⚡ Generate";
    // Auto-expand textarea
    promptInput.style.height = "auto";
    promptInput.style.height = promptInput.scrollHeight + "px";
  });

  // ⭐ MAIN Generate function
  const generateEmail = async (customPrompt = null) => {
    const prompt = customPrompt || promptInput.value.trim();
    lastPrompt = prompt; // store for regenerate

    if (prompt === "") {
      outputText.innerText = "⚠️ Please enter a prompt before generating!";
      outputText.style.color = "#FFD700";
      return;
    }

    generateBtn.innerText = "🔄 Generating…";
    generateBtn.disabled = true;
    promptInput.disabled = true;

    // spinner
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
      '<span class="email-spinner"></span><span>✉️ Generating your email...</span>';
    outputText.classList.add("loading");
    outputText.style.color = "#EAEAEA";

    try {
      const response = await fetch(
        "https://mail-karo.onrender.com/api/generate-email",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt }),
        }
      );

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Failed to generate email");

      outputText.classList.remove("loading");
      outputText.innerText = data.email;
      generateBtn.innerText = "🌟 Generated!";
    } catch (err) {
      outputText.classList.remove("loading");
      outputText.innerText = `⚠️ Error: ${
        err.message || "Failed to generate email."
      }`;
      outputText.style.color = "#FF6B6B";
      generateBtn.innerText = "❌ Try Again";
    }

    generateBtn.disabled = false;
    promptInput.disabled = false;
  };

  // ⭐ Generate Button Click
  generateBtn.addEventListener("click", () => generateEmail());

  // ⭐ Copy Button
  copyBtn.addEventListener("click", () => {
    navigator.clipboard.writeText(outputText.innerText);
    copyBtn.innerText = "✓ Copied!";
    setTimeout(() => (copyBtn.innerText = "📋 Copy"), 1500);
  });

  // ⭐ Reset Button
  resetBtn.addEventListener("click", () => {
    promptInput.value = "";
    outputText.innerText = "Your AI-generated email will appear here...";
    generateBtn.innerText = "⚡ Generate";
    promptInput.style.height = "50px"; // reset height
  });

  // ⭐ Regenerate Button (same last prompt)
  regenerateBtn.addEventListener("click", () => {
    if (lastPrompt.trim() === "") return;
    generateEmail(lastPrompt);
  });
});

// ✨ Loading animation
const promptStyle = document.createElement("style");
promptStyle.innerHTML = `
.loading { animation: blink 0.8s infinite; }
@keyframes blink { 0%,100%{opacity:.5;} 50%{opacity:1;} }
`;
document.head.appendChild(promptStyle);
