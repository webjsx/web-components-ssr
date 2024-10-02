import { expect } from "chai";
import { convertToDSD } from "../../convertToDSD.js";
import "../setup.js";
import { setupJSDOM } from "../setup.js";

describe("convertToDSD - Basic Functionality", () => {
  beforeEach(() => {
    setupJSDOM();
  });

  afterEach(() => {
    window.close();
  });

  it("should return a new HTMLElement", () => {
    document.body.innerHTML = `<div id="root">Hello World</div>`;
    const root = document.getElementById("root") as HTMLElement;
    const newRoot = convertToDSD(root);
    expect(newRoot).to.be.instanceOf(HTMLElement);
  });

  it("should preserve the tag name", () => {
    document.body.innerHTML = `<section id="root">Content</section>`;
    const root = document.getElementById("root") as HTMLElement;
    const newRoot = convertToDSD(root);
    expect(newRoot.tagName.toLowerCase()).to.equal("section");
  });
});
