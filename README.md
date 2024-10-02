# web-components-ssr

`web-components-ssr` converts Web Components with Shadow DOM into Declarative Shadow DOM (DSD), enabling their use in Server-Side Rendering (SSR).

## Installation

```bash
npm install web-components-ssr
```

## Usage Example with JSDOM

To use this library in a server-side context, you can simulate a DOM using JSDOM.

```typescript
import { JSDOM } from "jsdom";
import { convertToDSD } from "web-components-ssr";

// Create a simulated DOM environment
const dom = new JSDOM(`<!DOCTYPE html><body><div id="app"></div></body>`);
global.document = dom.window.document;
global.HTMLElement = dom.window.HTMLElement;
global.customElements = dom.window.customElements;

// Define nested custom elements
class ChildComponent extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: "open" });
    shadow.innerHTML = `<span>Child Shadow</span>`;
  }
}
class ParentComponent extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: "open" });
    shadow.innerHTML = `<child-component></child-component>`;
  }
}
customElements.define("child-component", ChildComponent);
customElements.define("parent-component", ParentComponent);

// Create and append the parent element
const parentElement = document.createElement("parent-component");
document.body.appendChild(parentElement);

// Convert the parent element and its nested custom elements to Declarative Shadow DOM
const dsdElement = convertToDSD(parentElement);

// Output the transformed HTML for SSR
console.log(dsdElement.outerHTML);
```

### Output

```html
<parent-component>
  <template shadowrootmode="open">
    <child-component>
      <template shadowrootmode="open">
        <span>Child Shadow</span>
      </template>
    </child-component>
  </template>
</parent-component>
```

### Running Tests

Install dependencies and run:

```bash
npm install
npm test
```

## License

MIT License
