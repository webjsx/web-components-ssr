import { expect } from "chai";
import { convertToDSD } from "../../convertToDSD.js";
import "../setup.js";
import { setupJSDOM } from "../setup.js";

describe("convertToDSD - Custom Elements", () => {
  beforeEach(() => {
    setupJSDOM();
  });

  afterEach(() => {
    window.close();
  });

  it("should identify and process custom elements with hyphens", () => {
    document.body.innerHTML = `<my-element id="root"></my-element>`;
    const root = document.getElementById("root") as HTMLElement;
    const newRoot = convertToDSD(root);
    expect(newRoot.tagName.toLowerCase()).to.equal("my-element");
  });

  it("should not treat standard elements as custom elements", () => {
    document.body.innerHTML = `<div id="root"></div>`;
    const root = document.getElementById("root") as HTMLElement;
    const newRoot = convertToDSD(root);
    expect(newRoot.tagName.toLowerCase()).to.equal("div");
  });
});
