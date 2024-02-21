import * as fse from "fs-extra";
import { expect } from "chai";
import path from "./assert_path";
import helper from "./helper";
import { ExistsResult } from "../types";
import * as jetpack from "..";

describe("downloads a remote file", () => {
  beforeEach(helper.setCleanTestCwd);
  afterEach(helper.switchBackToCorrectCwd);

  it("async", (done) => {
    jetpack.downloadAsync('async.html', 'https://example.com')
      .then(() => {
        jetpack.existsAsync("async.html").then((exists: unknown) => {
          expect(exists).to.equal('file');
          done();
        });
      }).catch(done)
    });
});
