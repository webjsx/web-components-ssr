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
      "template[shadowrootmode='open']"
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
      "template[shadowrootmode='open']"
    ) as HTMLTemplateElement;
    expect(childTemplate).to.not.be.null;

    // Access the content of the child template
    const childContent = childTemplate?.content;
    expect(childContent).to.not.be.null;

    expect(childContent?.querySelector("span")?.textContent).to.equal(
      "Child Shadow"
    );
  });

  it("should handle multiple levels of nested custom elements", () => {
    class GrandChildElement extends window.HTMLElement {
      constructor() {
        super();
        const shadow = this.attachShadow({ mode: "open" });
        shadow.innerHTML = `<em>Grandchild Shadow</em>`;
      }
    }

    class ChildElement extends window.HTMLElement {
      constructor() {
        super();
        const shadow = this.attachShadow({ mode: "open" });
        shadow.innerHTML = `<grand-child-element></grand-child-element>`;
      }
    }

    class ParentElement extends window.HTMLElement {
      constructor() {
        super();
        const shadow = this.attachShadow({ mode: "open" });
        shadow.innerHTML = `<child-element></child-element>`;
      }
    }

    // Define custom elements if not already defined
    if (!window.customElements.get("grand-child-element")) {
      window.customElements.define("grand-child-element", GrandChildElement);
    }
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

    const root = document.getElementById("root") as HTMLElement;
    const newRoot = convertToDSD(root);

    // Check parent-element
    expect(newRoot.tagName.toLowerCase()).to.equal("parent-element");
    const parentTemplate = newRoot.querySelector(
      "template[shadowrootmode='open']"
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
      "template[shadowrootmode='open']"
    ) as HTMLTemplateElement;
    expect(childTemplate).to.not.be.null;

    // Access the content of the child template
    const childContent = childTemplate?.content;
    expect(childContent).to.not.be.null;

    // Check grand-child-element inside child
    const grandChildElement = childContent?.querySelector(
      "grand-child-element"
    );
    expect(grandChildElement).to.not.be.null;

    // Check grand-child-element's template
    const grandChildTemplate = grandChildElement?.querySelector(
      "template[shadowrootmode='open']"
    ) as HTMLTemplateElement;
    expect(grandChildTemplate).to.not.be.null;

    // Access the content of the grandchild template
    const grandChildContent = grandChildTemplate?.content;
    expect(grandChildContent).to.not.be.null;

    expect(grandChildContent?.querySelector("em")?.textContent).to.equal(
      "Grandchild Shadow"
    );
  });

  it("should handle multiple nested custom elements at the same level", () => {
    class ChildOneElement extends window.HTMLElement {
      constructor() {
        super();
        const shadow = this.attachShadow({ mode: "open" });
        shadow.innerHTML = `<span>Child One Shadow</span>`;
      }
    }

    class ChildTwoElement extends window.HTMLElement {
      constructor() {
        super();
        const shadow = this.attachShadow({ mode: "open" });
        shadow.innerHTML = `<span>Child Two Shadow</span>`;
      }
    }

    class ParentElement extends window.HTMLElement {
      constructor() {
        super();
        const shadow = this.attachShadow({ mode: "open" });
        shadow.innerHTML = `
          <child-one-element></child-one-element>
          <child-two-element></child-two-element>
        `;
      }
    }

    // Define custom elements if not already defined
    if (!window.customElements.get("child-one-element")) {
      window.customElements.define("child-one-element", ChildOneElement);
    }
    if (!window.customElements.get("child-two-element")) {
      window.customElements.define("child-two-element", ChildTwoElement);
    }
    if (!window.customElements.get("parent-element")) {
      window.customElements.define("parent-element", ParentElement);
    }

    // Set the innerHTML after defining custom elements
    document.body.innerHTML = `
      <parent-element id="root">
        <child-one-element></child-one-element>
        <child-two-element></child-two-element>
      </parent-element>`;

    const root = document.getElementById("root") as HTMLElement;
    const newRoot = convertToDSD(root);

    // Check parent-element
    expect(newRoot.tagName.toLowerCase()).to.equal("parent-element");
    const parentTemplate = newRoot.querySelector(
      "template[shadowrootmode='open']"
    ) as HTMLTemplateElement;
    expect(parentTemplate).to.not.be.null;

    // Access the content of the parent template
    const parentContent = parentTemplate?.content;
    expect(parentContent).to.not.be.null;

    // Check child-one-element inside parent
    const childOneElement = parentContent?.querySelector("child-one-element");
    expect(childOneElement).to.not.be.null;

    // Check child-one-element's template
    const childOneTemplate = childOneElement?.querySelector(
      "template[shadowrootmode='open']"
    ) as HTMLTemplateElement;
    expect(childOneTemplate).to.not.be.null;

    // Access the content of child-one template
    const childOneContent = childOneTemplate?.content;
    expect(childOneContent).to.not.be.null;

    expect(childOneContent?.querySelector("span")?.textContent).to.equal(
      "Child One Shadow"
    );

    // Check child-two-element inside parent
    const childTwoElement = parentContent?.querySelector("child-two-element");
    expect(childTwoElement).to.not.be.null;

    // Check child-two-element's template
    const childTwoTemplate = childTwoElement?.querySelector(
      "template[shadowrootmode='open']"
    ) as HTMLTemplateElement;
    expect(childTwoTemplate).to.not.be.null;

    // Access the content of child-two template
    const childTwoContent = childTwoTemplate?.content;
    expect(childTwoContent).to.not.be.null;

    expect(childTwoContent?.querySelector("span")?.textContent).to.equal(
      "Child Two Shadow"
    );
  });

  it("should handle mixed nesting with custom and standard elements", () => {
    class CustomChildElement extends window.HTMLElement {
      constructor() {
        super();
        const shadow = this.attachShadow({ mode: "open" });
        shadow.innerHTML = `<strong>Custom Child Shadow</strong>`;
      }
    }

    class CustomParentElement extends window.HTMLElement {
      constructor() {
        super();
        const shadow = this.attachShadow({ mode: "open" });
        shadow.innerHTML = `
          <div>
            <custom-child-element></custom-child-element>
            <p>Standard Paragraph</p>
          </div>
        `;
      }
    }

    // Define custom elements if not already defined
    if (!window.customElements.get("custom-child-element")) {
      window.customElements.define("custom-child-element", CustomChildElement);
    }
    if (!window.customElements.get("custom-parent-element")) {
      window.customElements.define(
        "custom-parent-element",
        CustomParentElement
      );
    }

    // Set the innerHTML after defining custom elements
    document.body.innerHTML = `
      <custom-parent-element id="root">
        <custom-child-element></custom-child-element>
        <p>Another Paragraph</p>
      </custom-parent-element>`;

    const root = document.getElementById("root") as HTMLElement;
    const newRoot = convertToDSD(root);

    // Check custom-parent-element
    expect(newRoot.tagName.toLowerCase()).to.equal("custom-parent-element");
    const parentTemplate = newRoot.querySelector(
      "template[shadowrootmode='open']"
    ) as HTMLTemplateElement;
    expect(parentTemplate).to.not.be.null;

    // Access the content of the parent template
    const parentContent = parentTemplate?.content;
    expect(parentContent).to.not.be.null;

    // Check the div inside parent
    const div = parentContent?.querySelector("div");
    expect(div).to.not.be.null;

    // Check custom-child-element inside div
    const customChildElement = div?.querySelector("custom-child-element");
    expect(customChildElement).to.not.be.null;

    // Check custom-child-element's template
    const customChildTemplate = customChildElement?.querySelector(
      "template[shadowrootmode='open']"
    ) as HTMLTemplateElement;
    expect(customChildTemplate).to.not.be.null;

    // Access the content of the custom child template
    const customChildContent = customChildTemplate?.content;
    expect(customChildContent).to.not.be.null;

    expect(customChildContent?.querySelector("strong")?.textContent).to.equal(
      "Custom Child Shadow"
    );

    // Check standard paragraph inside div
    const standardParagraph = div?.querySelector("p");
    expect(standardParagraph).to.not.be.null;
    expect(standardParagraph?.textContent).to.equal("Standard Paragraph");

    // Additionally, check the standard paragraph outside the shadow DOM
    const externalParagraph = newRoot.querySelector("p");
    expect(externalParagraph).to.not.be.null;
    expect(externalParagraph?.textContent).to.equal("Another Paragraph");
  });
});
