import { expect } from "chai";
import { convertToDSD } from "../../convertToDSD.js";
import "../setup.js";
import { setupJSDOM } from "../setup.js";

describe("convertToDSD - Shadow DOM", () => {
  beforeEach(() => {
    setupJSDOM();

    class MyElement extends window.HTMLElement {
      constructor() {
        super();
        const shadow = this.attachShadow({ mode: "open" });
        shadow.innerHTML = `<p>Shadow Content</p>`;
      }
    }

    // Define the custom element
    if (!window.customElements.get("my-element")) {
      window.customElements.define("my-element", MyElement);
    }
  });

  afterEach(() => {
    window.close();
  });

  it("should convert open shadow DOM to Declarative Shadow DOM", () => {
    document.body.innerHTML = `<my-element id="root"></my-element>`;

    // Since custom elements are upgraded synchronously, proceed immediately
    const root = document.getElementById("root") as HTMLElement;
    const newRoot = convertToDSD(root);

    const template = newRoot.querySelector("template[shadowrootmode='open']") as HTMLTemplateElement;
    expect(template).to.not.be.null;
    expect(template?.content.querySelector("p")?.textContent).to.equal(
      "Shadow Content"
    );
  });

  it("should ignore closed shadow DOM", () => {
    // Redefine MyElement with a closed shadow DOM
    class MyClosedElement extends window.HTMLElement {
      constructor() {
        super();
        const shadow = this.attachShadow({ mode: "closed" });
        shadow.innerHTML = `<p>Closed Shadow Content</p>`;
      }
    }

    // Define the closed custom element
    if (!window.customElements.get("my-closed-element")) {
      window.customElements.define("my-closed-element", MyClosedElement);
    }

    document.body.innerHTML = `<my-closed-element id="root"></my-closed-element>`;

    const root = document.getElementById("root") as HTMLElement;
    const newRoot = convertToDSD(root);

    const template = newRoot.querySelector("template[shadowrootmode='open']");
    expect(template).to.be.null;
  });
});
