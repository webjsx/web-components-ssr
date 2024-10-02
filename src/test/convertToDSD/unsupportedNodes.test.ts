import { expect } from "chai";
import { convertToDSD } from "../../convertToDSD.js";
import "../setup.js";
import { setupJSDOM } from "../setup.js";

describe("convertToDSD - Unsupported Nodes", () => {
  beforeEach(() => {
    setupJSDOM();
  });

  afterEach(() => {
    window.close();
  });

  it("should ignore unsupported node types and preserve supported nodes", () => {
    // Removed <!DOCTYPE html> to prevent extra nodes
    document.body.innerHTML = `<div id="root"><!-- A comment --><script>console.log('Hello');</script><style>.class { color: red; }</style></div>`;

    const root = document.getElementById("root") as HTMLElement;
    const newRoot = convertToDSD(root);

    // The comment node should be preserved
    const comment = newRoot.childNodes[0];
    expect(comment.nodeType).to.equal(Node.COMMENT_NODE);
    expect(comment.textContent).to.equal(" A comment ");

    // The script and style tags should be preserved as ELEMENT_NODEs
    const script = newRoot.childNodes[1];
    expect(script.nodeType).to.equal(Node.ELEMENT_NODE);
    expect((script as HTMLElement).tagName.toLowerCase()).to.equal("script");

    const style = newRoot.childNodes[2];
    expect(style.nodeType).to.equal(Node.ELEMENT_NODE);
    expect((style as HTMLElement).tagName.toLowerCase()).to.equal("style");
  });

  it("should replace unsupported node types with empty text nodes", () => {
    // Removed <!DOCTYPE html> to prevent extra nodes
    document.body.innerHTML = `<div id="root"><!-- Comment --><?processing instruction?><unknown-node></unknown-node></div>`;

    const root = document.getElementById("root") as HTMLElement;
    const newRoot = convertToDSD(root);

    // Comment node should be preserved
    const comment = newRoot.childNodes[0];
    expect(comment.nodeType).to.equal(Node.COMMENT_NODE);
    expect(comment.textContent).to.equal(" Comment ");

    // Processing instruction should be replaced with an empty text node
    const placeholder = newRoot.childNodes[1];
    expect(placeholder.nodeType).to.equal(Node.COMMENT_NODE);
    expect(placeholder.textContent).to.equal("?processing instruction?");

    // Unknown node should be preserved as ELEMENT_NODE
    const unknown = newRoot.childNodes[2];
    expect(unknown.nodeType).to.equal(Node.ELEMENT_NODE);
    expect((unknown as HTMLElement).tagName.toLowerCase()).to.equal(
      "unknown-node"
    );
  });
});
