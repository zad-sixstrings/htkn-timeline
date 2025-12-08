import { useState } from "react";

// Parse flags
function parseFlags(text) {
  return text.replace(/\{flag-([\w]{2})\}(\S+)/g, (match, code, name) => {
    const countryCode = code.toLowerCase();
    return `<span style="white-space: nowrap;"><img src="/flags/${countryCode}.svg" alt="${countryCode}" class="flag-icon" />${name}</span>`;
  });
}

// Parse inline tooltips
function parseInlineTooltips(text) {
  const parts = [];
  let lastIndex = 0;
  const regex = /\{(\?):([^}]+)\}/g;
  let match;
  let tooltipId = 0;

  while ((match = regex.exec(text)) !== null) {
    // Add text before the tooltip
    if (match.index > lastIndex) {
      parts.push({
        type: "text",
        content: text.substring(lastIndex, match.index),
      });
    }

    // Add the tooltip
    parts.push({
      type: "tooltip",
      content: match[2],
      id: tooltipId++,
    });

    lastIndex = regex.lastIndex;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push({
      type: "text",
      content: text.substring(lastIndex),
    });
  }

  return parts.length > 0 ? parts : [{ type: "text", content: text }];
}

// Parse Markdown links
function parseLinks(text) {
  return text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, text, url) => {
    return `<a href="${url}" target="_blank" rel="noopener noreferrer">${text}</a>`;
  });
}

// Individual tooltip trigger (no bubble - that's rendered separately)
function TooltipTrigger({ id, active, onClick }) {
  return (
    <span className="inline-tooltip-wrapper">
      <button
        className="inline-tooltip-trigger"
        onClick={() => onClick(id)}
        aria-label="Plus d'informations"
      >
        ?
      </button>
    </span>
  );
}

// Handle tooltips, flags, and markdown links
export default function Parser({ text }) {
  const [activeTooltip, setActiveTooltip] = useState(null);

  // Parse the text for tooltips first, then apply other parsings
  const parts = parseInlineTooltips(text);
  
  // Get the content of the active tooltip
  const activeTooltipContent = activeTooltip !== null 
    ? parts.find(p => p.type === "tooltip" && p.id === activeTooltip)?.content 
    : null;

  const handleTooltipClick = (id) => {
    setActiveTooltip(activeTooltip === id ? null : id);
  };

  const handleBackdropClick = () => {
    setActiveTooltip(null);
  };

  return (
    <>
      {activeTooltipContent && (
        <div className="inline-tooltip-bubble">
          {activeTooltipContent}
        </div>
      )}
      
      <p>
        {parts.map((part, index) => {
          if (part.type === "tooltip") {
            return (
              <TooltipTrigger
                key={index}
                id={part.id}
                active={activeTooltip === part.id}
                onClick={handleTooltipClick}
              />
            );
          } else {
            // Apply flags and links parsing to text parts
            return (
              <span
                key={index}
                dangerouslySetInnerHTML={{
                  __html: parseLinks(parseFlags(part.content)),
                }}
              />
            );
          }
        })}
      </p>
      
      {/* Backdrop to close tooltip when tapping outside */}
      {activeTooltip !== null && (
        <div className="inline-tooltip-backdrop" onClick={handleBackdropClick} />
      )}
    </>
  );
}