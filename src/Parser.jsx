import { useState } from "react";

// Parse flags
function parseFlags(text) {
  return text.replace(/\{flag-([\w]{2})\}(\S+)/g, (match, code, name) => {
    const countryCode = code.toLowerCase();
    return `<span style="white-space: nowrap;"><img src="/flags/${countryCode}.svg" alt="${countryCode}" class="flag-icon" />${name}</span>`;
  });
}

// Parse inline tooltips - convert {?:tooltip text} to clickable spans
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

// Individual tooltip trigger and bubble
function TooltipTrigger({ id, content, active, onClick }) {
  return (
    <span className="inline-tooltip-wrapper">
      <button
        className="inline-tooltip-trigger"
        onClick={() => onClick(id)}
        aria-label="Plus d'informations"
      >
        ?
      </button>
      {active && <span className="inline-tooltip-bubble">{content}</span>}
    </span>
  );
}

// Main parser component - handles tooltips, flags, and markdown links
export default function Parser({ text }) {
  const [activeTooltip, setActiveTooltip] = useState(null);

  // Parse the text for tooltips first, then apply other parsing to text parts
  const parts = parseInlineTooltips(text);

  const handleTooltipClick = (id) => {
    setActiveTooltip(activeTooltip === id ? null : id);
  };

  const handleBackdropClick = () => {
    setActiveTooltip(null);
  };

  return (
    <>
      <p>
        {parts.map((part, index) => {
          if (part.type === "tooltip") {
            return (
              <TooltipTrigger
                key={index}
                id={part.id}
                content={part.content}
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