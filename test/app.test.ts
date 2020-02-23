import nock from "nock";

import { OAuthApp } from "../src";

describe("app", () => {
  let app: OAuthApp;

  beforeEach(() => {
    app = new OAuthApp({
      clientId: "0123",
      clientSecret: "0123secret"
    });
  });
  it("app.getAuthorizationUrl", () => {
    expect(app.getAuthorizationUrl).toBeInstanceOf(Function);
  });

  it("app.getAuthorizationUrl(options)", () => {
    const app = new OAuthApp({
      clientId: "0123",
      clientSecret: "0123secret"
    });
    const url = app.getAuthorizationUrl({
      state: "state123"
    });
    expect(url).toStrictEqual(
      "https://github.com/login/oauth/authorize?allow_signup=true&client_id=0123&state=state123"
    );
  });

  it("app.createToken", () => {
    expect(app.createToken).toBeInstanceOf(Function);
  });

  it("createToken(options)", async () => {
    nock("https://github.com")
      .post("/login/oauth/access_token")
      .reply(200, {
        access_token: "token123",
        scope: "repo,gist",
        token_type: "bearer"
      });

    const { token, scopes } = await app.createToken({
      state: "state123",
      code: "code123"
    });

    expect(token).toEqual("token123");
    expect(scopes).toEqual(["repo", "gist"]);
  });
});
