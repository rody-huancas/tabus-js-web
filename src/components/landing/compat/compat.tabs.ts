export const initCompatTabs = (): void => {
  const tabs = Array.from(
    document.querySelectorAll<HTMLButtonElement>(".compat-tab"),
  );

  const codeEl     = document.querySelector<HTMLElement>("#compat-code");
  const filenameEl = document.querySelector<HTMLElement>("#compat-filename");
  const panelEl    = document.querySelector<HTMLPreElement>("#compat-panel");
  const copyButton = document.querySelector<HTMLButtonElement>("#compat-copy");

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  if (tabs.length && codeEl && filenameEl && panelEl) {
    const applyFramework = (tab: HTMLButtonElement) => {
      codeEl.innerHTML       = tab.dataset.html ?? "";
      filenameEl.textContent = tab.dataset.filename ?? "";

      panelEl.setAttribute("aria-labelledby", tab.id);

      if (copyButton) copyButton.dataset.code = tab.dataset.raw ?? "";
    };

    const selectTab = (tab: HTMLButtonElement) => {
      tabs.forEach((t) =>
        t.setAttribute("aria-selected", t === tab ? "true" : "false"),
      );

      if (prefersReducedMotion) {
        applyFramework(tab);
        return;
      }

      panelEl.classList.add("compat-fade-out");
      window.setTimeout(() => {
        applyFramework(tab);
        panelEl.classList.remove("compat-fade-out");
      }, 150);
    };

    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        if (tab.getAttribute("aria-selected") === "true") return;
        selectTab(tab);
      });
    });
  }

  if (copyButton) {
    const icon  = document.querySelector<HTMLElement>("#compat-copy-icon");
    const check = document.querySelector<HTMLElement>("#compat-copy-check");
    const label = document.querySelector<HTMLElement>("#compat-copy-label");

    let resetTimeout: ReturnType<typeof setTimeout> | undefined;

    copyButton.addEventListener("click", async () => {
      const code = copyButton.dataset.code ?? "";

      try {
        await navigator.clipboard.writeText(code);
      } catch {
        return;
      }

      icon?.classList.add("hidden");
      check?.classList.remove("hidden");

      if (label) label.textContent = "Copiado";

      clearTimeout(resetTimeout);
      resetTimeout = setTimeout(() => {
        icon?.classList.remove("hidden");
        check?.classList.add("hidden");
        
        if (label) label.textContent = "Copiar";
      }, 1600);
    });
  }
};
