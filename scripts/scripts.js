/*
  Main interaction script
  Handles:
  - Opening and closing the folder body via the floating toggle
  - Creating the "show more" behavior for social links
  - Triggering the loader exit animation
*/

document.addEventListener("DOMContentLoaded", () => {
  // Floating toggle container and elements
  const floating = document.querySelector(".floating-toggle");
  const toggleWrap = document.getElementById("toggleLinks");
  const linksWrapper = document.getElementById("linksWrapper");
  const label = document.getElementById("toggleLabel");

  // Tracks whether the folder is currently open
  let open = false;

  if (floating && toggleWrap && linksWrapper) {
    // Clicking anywhere on the floating control toggles folder open or closed
    floating.addEventListener("click", () => {
      open = !open;

      // When closing the folder, also snap extra socials shut instantly
      if (!open) {
        const extraWrapper = document.querySelector(".social-extra");
        const extraBtn = document.querySelector(".social-toggle-btn");

        if (extraWrapper) {
          // Temporarily remove the transition so it collapses without waiting
          const previousTransition = extraWrapper.style.transition;
          extraWrapper.style.transition = "none";

          // Remove expanded state so wrapper jumps to collapsed max-height
          extraWrapper.classList.remove("expanded");

          // Force layout so the browser applies the style change right away
          // This reads a layout property which flushes pending changes
          void extraWrapper.offsetHeight;

          // Restore original transition for next manual open or close
          extraWrapper.style.transition = previousTransition;
        }

        if (extraBtn) {
          extraBtn.setAttribute("aria-expanded", "false");
          extraBtn.textContent = "Show more";
        }
      }

      // Toggle folder body expansion
      linksWrapper.classList.toggle("expanded", open);

      // Rotate arrow and glow state of the toggle
      toggleWrap.classList.toggle("active", open);

      // Used by CSS to shrink the hero when links are open
      document.body.classList.toggle("links-open", open);

      // Update small label under arrows
      if (label) {
        label.textContent = open ? "Hide" : "Show";
      }
    });
  }

  /*
    Social "show more" behavior

    Logic:
    - Find all .social-card elements.
    - Keep the first two as static visible cards.
    - Wrap all remaining cards inside .social-extra > .social-extra-inner.
    - Add a "Show more" button that toggles .expanded on the wrapper.
  */
  const socialGrid = document.querySelector(".social-grid");

  if (socialGrid) {
    // All social cards in their original DOM order
    const cards = Array.from(socialGrid.querySelectorAll(".social-card"));

    // Only build the extra wrapper if there are more than two cards
    if (cards.length > 2) {
      const extraCards = cards.slice(2);

      // Wrapper for all extra cards - behaves like a small subfolder
      const extraWrapper = document.createElement("div");
      extraWrapper.className = "social-extra";

      // Inner grid keeps extra cards in two columns while inside the wrapper
      const inner = document.createElement("div");
      inner.className = "social-extra-inner";

      // Move the extra cards into the inner grid
      extraCards.forEach(card => inner.appendChild(card));
      extraWrapper.appendChild(inner);

      // Append wrapper after the first two cards inside the main social grid
      socialGrid.appendChild(extraWrapper);

      // Create the toggle button under the grid
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "social-toggle-btn";
      btn.textContent = "Show more";
      btn.setAttribute("aria-expanded", "false");

      // Toggle expanded state on click
      btn.addEventListener("click", () => {
        const isExpanded = extraWrapper.classList.toggle("expanded");
        btn.setAttribute("aria-expanded", String(isExpanded));
        btn.textContent = isExpanded ? "Hide" : "Show more";
      });

      // Attach the button inside the social grid so it sits at bottom right
      socialGrid.appendChild(btn);
    }
  }
});

/*
  Loader animation trigger

  When the whole page including images has loaded, we wait a small delay
  then add the site-loaded class to the body. This kicks off all the loader
  transitions defined in CSS.

  To shorten how long the loader stays on screen, reduce the timeout value.
*/
window.addEventListener("load", () => {
  setTimeout(() => {
    document.body.classList.add("site-loaded");
  }, 550); // Duration before loader panels start sliding away
});
