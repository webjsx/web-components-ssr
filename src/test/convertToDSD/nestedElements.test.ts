import { expect } from "chai";
import { convertToDSD } from "../../convertToDSD.js";
import "../setup.js";
import { setupJSDOM } from "../setup.js";

describe("convertToDSD - Nested Custom Elements", () => {
  beforeEach(() => {
    setupJSDOM();
  });

  afterEach(() => {
    window.close();
  });

  it("should correctly process nested custom elements with shadow DOM", () => {
    class ChildElement extends window.HTMLElement {
      constructor() {
        super();
        const shadow = this.attachShadow({ mode: "open" });
        shadow.innerHTML = `<span>Child Shadow</span>`;
      }
    }

    class ParentElement extends window.HTMLElement {
      constructor() {
        super();
        const shadow = this.attachShadow({ mode: "open" });
        shadow.innerHTML = `<div><child-element></child-element></div>`;
      }
    }

    // Define custom elements if not already defined
    if (!window.customElements.get("child-element")) {
      window.customElements.define("child-element", ChildElement);
    }
    if (!window.customElements.get("parent-element")) {
      window.customElements.define("parent-element", ParentElement);
    }

    // Set the innerHTML after defining custom elements
    document.body.innerHTML = `
      <parent-element id="root">
        <child-element></child-element>
      </parent-element>`;

    // Since JSDOM processes custom elements synchronously, proceed immediately
    const root = document.getElementById("root") as HTMLElement;
    const newRoot = convertToDSD(root);

    // Check parent-element
    expect(newRoot.tagName.toLowerCase()).to.equal("parent-element");
    const parentTemplate = newRoot.querySelector(
      "template[shadowroot='open']"
    ) as HTMLTemplateElement;
    expect(parentTemplate).to.not.be.null;

    // Access the content of the parent template
    const parentContent = parentTemplate?.content;
    expect(parentContent).to.not.be.null;

    // Check child-element inside parent
    const childElement = parentContent?.querySelector("child-element");
    expect(childElement).to.not.be.null;

    // Check child-element's template
    const childTemplate = childElement?.querySelector(
      "template[shadowroot='open']"
    ) as HTMLTemplateElement;
    expect(childTemplate).to.not.be.null;

    // Access the content of the child template
    const childContent = childTemplate?.content;
    expect(childContent).to.not.be.null;

    expect(childContent?.querySelector("span")?.textContent).to.equal(
      "Child Shadow"
    );
  });
});
