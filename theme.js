const root = document.documentElement;

try {
    root.dataset.theme = localStorage.getItem("theme") || "light";
} catch {
    root.dataset.theme = "light";
}

document.addEventListener("DOMContentLoaded", () => {
    const toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "theme-toggle";
    document.querySelector("footer").append(toggle);

    const updateLabel = () => {
        toggle.textContent = root.dataset.theme === "dark"
            ? "Switch to light mode"
            : "Switch to dark mode";
    };

    toggle.addEventListener("click", () => {
        const next = root.dataset.theme === "dark" ? "light" : "dark";
        const switchTheme = () => {
            root.dataset.theme = next;
            updateLabel();
        };

          if (document.startViewTransition) {
            document.startViewTransition(switchTheme);
        } else {
            switchTheme();
        }

        try {
            localStorage.setItem("theme", next);
        } catch {}
    });

    updateLabel();
});
