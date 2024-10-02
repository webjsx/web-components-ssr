export function convertToDSD(rootElement: HTMLElement): HTMLElement {
  
  function isCustomElement(tagName: string): boolean {
    return tagName.includes("-");
  }

  function copyAttributes(source: HTMLElement, target: HTMLElement): void {
    Array.from(source.attributes).forEach((attr) => {
      target.setAttribute(attr.name, attr.value);
    });
  }

  function processNode(originalNode: Node): Node | null {
    switch (originalNode.nodeType) {
      case Node.ELEMENT_NODE:
        const originalElement = originalNode as HTMLElement;
        const tagName = originalElement.tagName.toLowerCase();
        const newElement = document.createElement(tagName);

        // Copy attributes
        copyAttributes(originalElement, newElement);

        if (isCustomElement(tagName)) {
          const shadowRoot = originalElement.shadowRoot;

          if (shadowRoot && shadowRoot.mode === "open") {
            const template = document.createElement("template");
            template.setAttribute("shadowrootmode", "open");

            // Recursively process shadowRoot's child nodes and append to template
            shadowRoot.childNodes.forEach((child) => {
              const processedChild = processNode(child);
              if (processedChild) {
                template.content.appendChild(processedChild);
              }
            });

            // Append the template to the new custom element
            newElement.appendChild(template);
          }
        }

        // Recursively process and append child nodes (light DOM)
        originalElement.childNodes.forEach((child) => {
          const processedChild = processNode(child);
          if (processedChild) {
            newElement.appendChild(processedChild);
          }
        });

        return newElement;

      case Node.TEXT_NODE:
        const originalText = originalNode as Text;
        const textContent = originalText.textContent || "";
        if (/^\s*$/.test(textContent)) {
          return null;
        }
        return document.createTextNode(textContent);

      case Node.COMMENT_NODE:
        const originalComment = originalNode as Comment;
        return document.createComment(originalComment.textContent || "");

      case Node.PROCESSING_INSTRUCTION_NODE:
        return document.createTextNode("");

      default:
        return document.createTextNode("");
    }
  }

  const newRoot = processNode(rootElement) as HTMLElement;
  return newRoot;
}
