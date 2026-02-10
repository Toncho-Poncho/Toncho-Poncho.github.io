document.addEventListener('DOMContentLoaded', async () => {
  const summaryElement = document.querySelector('.summary-panel p');
  const coreFocusElement = document.querySelector('.corefocus-panel p');

  if (!summaryElement) {
    console.error('Summary element not found');
    return;
  }

  try {
    const response = await fetch('../Config/summary.txt');
    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }

    const text = await response.text();

    // Split by delimiter line '---'
    const parts = text.split(/\r?\n\s*---\s*\r?\n/);

    summaryElement.textContent = (parts[0] || '').trim();

    // Core focus is optional
    if (coreFocusElement) {
      coreFocusElement.textContent = (parts[1] || '').trim();
    }
  } catch (error) {
    console.error('Failed to load summary:', error);
  }
});
