/*
 * Estado central da apresentação: slide atual e fragments revelados por slide.
 * Não conhece teclado/botões/DOM de navegação — apenas expõe next()/prev()/onChange().
 */
(function () {
  const App = (window.App = window.App || {});
  const { getFragments, applyFragments } = App.fragments;

  class Deck {
    constructor(slideElements) {
      this.slides = slideElements;
      this.currentIndex = 0;
      this.fragmentsPerSlide = this.slides.map(getFragments);
      this.revealedCount = this.slides.map(() => 0);
      this._listeners = [];
    }

    get total() {
      return this.slides.length;
    }

    onChange(callback) {
      this._listeners.push(callback);
    }

    getState() {
      return {
        currentIndex: this.currentIndex,
        total: this.total,
        canGoNext: this.currentIndex < this.total - 1 || this._hasHiddenFragments(),
        canGoPrev: this.currentIndex > 0 || this._hasRevealedFragments(),
      };
    }

    init() {
      this.slides.forEach((slide, i) => {
        slide.classList.toggle("slide--active", i === this.currentIndex);
        slide.classList.remove("slide--exit-left");
      });
      this._syncFragments();
      this._emitChange();
    }

    next() {
      if (this._hasHiddenFragments()) {
        this.revealedCount[this.currentIndex]++;
        this._syncFragments();
        this._emitChange();
        return;
      }
      if (this.currentIndex < this.total - 1) {
        this._goTo(this.currentIndex + 1, "forward");
      }
    }

    prev() {
      if (this._hasRevealedFragments()) {
        this.revealedCount[this.currentIndex]--;
        this._syncFragments();
        this._emitChange();
        return;
      }
      if (this.currentIndex > 0) {
        this._goTo(this.currentIndex - 1, "backward");
        this.revealedCount[this.currentIndex] = this.fragmentsPerSlide[this.currentIndex].length;
        this._syncFragments();
        this._emitChange();
      }
    }

    _hasHiddenFragments() {
      return this.revealedCount[this.currentIndex] < this.fragmentsPerSlide[this.currentIndex].length;
    }

    _hasRevealedFragments() {
      return this.revealedCount[this.currentIndex] > 0;
    }

    _goTo(index, direction) {
      const outgoing = this.slides[this.currentIndex];
      const incoming = this.slides[index];

      outgoing.classList.remove("slide--active");
      outgoing.classList.toggle("slide--exit-left", direction === "forward");

      if (direction === "forward") {
        incoming.classList.remove("slide--exit-left");
      }
      incoming.classList.add("slide--active");

      this.currentIndex = index;
      this._emitChange();
    }

    _syncFragments() {
      applyFragments(this.fragmentsPerSlide[this.currentIndex], this.revealedCount[this.currentIndex]);
    }

    _emitChange() {
      const state = this.getState();
      this._listeners.forEach((cb) => cb(state));
    }
  }

  App.Deck = Deck;
})();
