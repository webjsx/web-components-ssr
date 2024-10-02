import { expect } from "chai";
import { convertToDSD } from "../../convertToDSD.js";
import "../setup.js";
import { setupJSDOM } from "../setup.js";

describe("convertToDSD - Attributes", () => {
  beforeEach(() => {
    setupJSDOM();
  });

  afterEach(() => {
    window.close();
  });

  it("should copy all attributes from the source to the target element", () => {
    document.body.innerHTML = `<div id="root" class="container" data-test="value"></div>`;
    const root = document.getElementById("root") as HTMLElement;
    const newRoot = convertToDSD(root);
    expect(newRoot.getAttribute("id")).to.equal("root");
    expect(newRoot.getAttribute("class")).to.equal("container");
    expect(newRoot.getAttribute("data-test")).to.equal("value");
  });

  it("should handle elements with no attributes gracefully", () => {
    document.body.innerHTML = `<span id="root"></span>`;
    const root = document.getElementById("root") as HTMLElement;
    const newRoot = convertToDSD(root);
    expect(newRoot.attributes.length).to.equal(1);
    expect(newRoot.getAttribute("id")).to.equal("root");
  });
});
