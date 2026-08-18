import assert from "node:assert/strict";
import test from "node:test";
import { remote } from "webdriverio";

const appiumOptions = {
  hostname: process.env.APPIUM_HOST || "127.0.0.1",
  port: Number(process.env.APPIUM_PORT || 4723),
  path: "/",
  capabilities: {
    platformName: "iOS",
    "appium:automationName": "XCUITest",
    "appium:deviceName": process.env.IOS_DEVICE_NAME || "iPhone 17",
    "appium:bundleId": "com.apexpro.app",
    "appium:noReset": true,
    "appium:newCommandTimeout": 180,
  },
};

async function elementoExiste(app, seletor) {
  try {
    return await app.$(seletor).isExisting();
  } catch {
    return false;
  }
}

async function aguardarTelaInicial(app) {
  let estado = "desconhecido";

  await app.waitUntil(async () => {
    if (await elementoExiste(app, "~ACESSO SUSPENSO")) {
      estado = "bloqueado";
      return true;
    }

    if (await elementoExiste(app, "~Usuário ou e-mail")) {
      estado = "login";
      return true;
    }

    return false;
  }, { timeout: 60_000, interval: 1_000 });

  return estado;
}

test("aluno suspenso vê o bloqueio de acesso no aplicativo", async () => {
  const app = await remote(appiumOptions);

  try {
    const estadoInicial = await aguardarTelaInicial(app);

    if (estadoInicial === "login") {
      const usuario = process.env.APPIUM_TEST_USER;
      const senha = process.env.APPIUM_TEST_PASSWORD;

      assert.ok(usuario && senha, "Defina as credenciais de teste apenas no terminal.");

      await app.$("~Usuário ou e-mail").setValue(usuario);
      await app.$("~Senha").setValue(senha);
      await app.$("~Entrar na conta").click();
    }

    const titulo = await app.$("~ACESSO SUSPENSO");
    await titulo.waitForExist({ timeout: 15_000 });
    assert.equal(await titulo.getText(), "ACESSO SUSPENSO");
  } finally {
    await app.deleteSession();
  }
});
