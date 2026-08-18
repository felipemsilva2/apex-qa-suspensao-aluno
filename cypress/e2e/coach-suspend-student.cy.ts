describe("Painel do coach — suspensão de aluno", () => {
  const coachId = "qa-coach-id";
  const tenantId = "qa-tenant-id";
  const clientId = "qa-suspended-client-id";

  const coachProfile = {
    id: coachId,
    tenant_id: tenantId,
    role: "coach",
    full_name: "Coach de Teste",
    email: "coach@example.com",
    phone: "11999999999",
    cpf: "52998224725",
    avatar_url: null,
    has_seen_tour: true,
    is_tenant_admin: true,
    is_complimentary: false,
    trial_end: null,
    subscription_status: "active",
    created_at: "2099-01-01T00:00:00.000Z",
    updated_at: "2099-01-01T00:00:00.000Z",
  };

  const tenant = {
    id: tenantId,
    business_name: "Academia QA",
    plan_tier: "pro",
    subscription_status: "active",
    current_period_end: "2099-12-31T00:00:00.000Z",
  };

  const makeClient = (status: "active" | "suspended" = "active") => ({
    id: clientId,
    tenant_id: tenantId,
    user_id: "qa-student-user-id",
    full_name: "Aluno Suspensão",
    email: "aluno.suspensao@example.com",
    status,
    assigned_coach_id: coachId,
    created_at: "2099-01-01T00:00:00.000Z",
    updated_at: "2099-01-01T00:00:00.000Z",
  });

  function mockCoachSession() {
    let authenticated = false;
    let client = makeClient();

    cy.intercept("GET", "**/functions/v1/auth-proxy*", (request) => {
      request.reply({
        statusCode: 200,
        body: {
          success: authenticated,
          session: authenticated
            ? { user: { id: coachId, email: coachProfile.email, email_confirmed: true } }
            : null,
          error: null,
        },
      });
    });

    cy.intercept("POST", "**/auth/v1/token?grant_type=password", (request) => {
      authenticated = true;
      request.reply({
        statusCode: 200,
        body: {
          access_token: "qa-access-token",
          refresh_token: "qa-refresh-token",
          expires_in: 3600,
          token_type: "bearer",
          user: { id: coachId, email: coachProfile.email, email_confirmed_at: "2099-01-01T00:00:00.000Z" },
        },
      });
    }).as("passwordLogin");

    cy.intercept("GET", "**/rest/v1/**", (request) => {
      request.reply({ statusCode: 200, body: [] });
    });

    cy.intercept("GET", "**/rest/v1/profiles*", (request) => {
      const url = decodeURIComponent(request.url);
      request.reply({
        statusCode: 200,
        body: url.includes(`id=eq.${coachId}`) ? coachProfile : [coachProfile],
      });
    });

    cy.intercept("GET", "**/rest/v1/tenants*", {
      statusCode: 200,
      body: tenant,
    });

    cy.intercept("GET", "**/rest/v1/subscriptions*", {
      statusCode: 200,
      body: { current_period_end: tenant.current_period_end },
    });

    cy.intercept("GET", "**/rest/v1/clients*", (request) => {
      const url = decodeURIComponent(request.url);
      request.reply({
        statusCode: 200,
        body: url.includes(`id=eq.${clientId}`) ? client : [client],
      });
    }).as("clientQuery");

    cy.intercept("PATCH", "**/rest/v1/clients*", (request) => {
      expect(request.body).to.include({ status: "suspended" });
      client = { ...client, status: "suspended" };
      request.reply({ statusCode: 200, body: client });
    }).as("suspendClient");

    cy.intercept("POST", "**/rest/v1/**", { statusCode: 200, body: [] });
  }

  it("mantém o aluno na tela e altera o status para Suspenso", () => {
    mockCoachSession();

    cy.visit("/login");
    cy.get("#login-identifier").type("coach@example.com");
    cy.get("#login-password").type("Apex#2026");
    cy.contains("button", "Entrar no sistema").click();
    cy.wait("@passwordLogin");

    cy.visit(`/dashboard/clients/${clientId}`);
    cy.contains("Aluno Suspensão").should("be.visible");
    cy.contains("button", "Ativo").click();
    cy.contains("[role=menuitem]", "Suspenso").click();

    cy.contains("h2", "Suspender Aluno?").should("be.visible");
    cy.contains("não poderá acessar o app enquanto estiver suspenso").should("be.visible");
    cy.contains("button", "Confirmar").click();

    cy.wait("@suspendClient");
    cy.contains("button", "Suspenso").should("be.visible");
    cy.contains("Status alterado para Suspenso").should("be.visible");
    cy.contains("Aluno Suspensão").should("be.visible");
  });
});
