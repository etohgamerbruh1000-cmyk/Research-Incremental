export function initializeGlobalTabs() {
  const tabButtons =
    document.querySelectorAll<HTMLButtonElement>("#tabList button");
  const tabPanels = document.querySelectorAll<HTMLElement>(".tab-content");

  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // Dynamically match "switchToAmoeba" -> "mainTab" or "switchToCells" -> "cellsTab"
      const buttonId = button.id;
      let targetId = "";

      if (buttonId === "switchToAmoeba") targetId = "mainTab";
      else if (buttonId.startsWith("switchTo")) {
        targetId = `${buttonId.replace("switchTo", "").toLowerCase()}Tab`;
      }

      if (!targetId) return;
      const targetPanel = document.getElementById(targetId);
      if (!targetPanel) return;

      tabPanels.forEach((panel) => panel.classList.add("hide"));
      targetPanel.classList.remove("hide");
    });
  });
}