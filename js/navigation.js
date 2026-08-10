/*
 * Lógica de navegação da apresentação: mantém o slide atual e quantos
 * fragments de cada slide já foram revelados, e sincroniza a interface
 * (slide ativo, botões, barra de progresso) com esse estado.
 */
(function () {
  const slides = Array.from(document.querySelectorAll("[data-slide]"));
  const fragmentsPerSlide = slides.map((slide) => Array.from(slide.querySelectorAll("[data-fragment]")));

  const prevBtn = document.querySelector('[data-nav="prev"]');
  const nextBtn = document.querySelector('[data-nav="next"]');
  const progressFillEl = createProgressFill(document.getElementById("progressBar"));

  const state = {
    currentSlide: 0,
    revealedFragments: slides.map(() => 0),
  };

  function createProgressFill(containerEl) {
    if (!containerEl) return null;
    const fillEl = document.createElement("div");
    fillEl.className = "progress-bar__fill";
    containerEl.appendChild(fillEl);
    return fillEl;
  }

  function hasHiddenFragments() {
    return state.revealedFragments[state.currentSlide] < fragmentsPerSlide[state.currentSlide].length;
  }

  function hasRevealedFragments() {
    return state.revealedFragments[state.currentSlide] > 0;
  }

  function nextSlide() {
    if (hasHiddenFragments()) {
      state.revealedFragments[state.currentSlide]++;
    } else if (state.currentSlide < slides.length - 1) {
      state.currentSlide++;
    } else {
      return;
    }
    renderSlide();
    updateProgress();
  }

  function previousSlide() {
    if (hasRevealedFragments()) {
      state.revealedFragments[state.currentSlide]--;
    } else if (state.currentSlide > 0) {
      state.currentSlide--;
      state.revealedFragments[state.currentSlide] = fragmentsPerSlide[state.currentSlide].length;
    } else {
      return;
    }
    renderSlide();
    updateProgress();
  }

  function renderSlide() {
    slides.forEach((slide, index) => {
      slide.classList.toggle("slide--active", index === state.currentSlide);
      slide.classList.toggle("slide--exit-left", index < state.currentSlide);
    });

    fragmentsPerSlide.forEach((fragments, slideIndex) => {
      fragments.forEach((fragmentEl, fragmentIndex) => {
        fragmentEl.classList.toggle("is-visible", fragmentIndex < state.revealedFragments[slideIndex]);
      });
    });

    prevBtn.disabled = state.currentSlide === 0 && !hasRevealedFragments();
    nextBtn.disabled = state.currentSlide === slides.length - 1 && !hasHiddenFragments();
  }

  // Progresso conta cada fragment revelado e cada troca de slide como uma
  // "etapa" — só chega a 100% no último fragment do último slide.
  function updateProgress() {
    if (!progressFillEl) return;

    const totalFragments = fragmentsPerSlide.reduce((sum, fragments) => sum + fragments.length, 0);
    const totalSteps = totalFragments + (slides.length - 1);

    const fragmentsBeforeCurrent = fragmentsPerSlide
      .slice(0, state.currentSlide)
      .reduce((sum, fragments) => sum + fragments.length, 0);
    const stepsSoFar = fragmentsBeforeCurrent + state.currentSlide + state.revealedFragments[state.currentSlide];

    const ratio = totalSteps > 0 ? stepsSoFar / totalSteps : 1;
    progressFillEl.style.width = `${ratio * 100}%`;
  }

  prevBtn.addEventListener("click", previousSlide);
  nextBtn.addEventListener("click", nextSlide);

  document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      nextSlide();
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      previousSlide();
    }
  });

  renderSlide();
  updateProgress();
})();
