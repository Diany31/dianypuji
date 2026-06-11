# OrangeHRM Demo Automation

Automation test untuk website [OrangeHRM Demo](https://opensource-demo.orangehrmlive.com) menggunakan:

- Cypress
- Page Object Model (POM)
- `cy.intercept()` untuk validasi request/response API

## Fitur yang diuji

- Login: 8 test case
- Directory: 8 test case
- Recruitment: 8 test case

Total: 24 test case.

## Cara menjalankan

```bash
npm install
npm run cy:run
```

Untuk mode interaktif:

```bash
npm run cy:open
```

## Struktur

```text
cypress/
  e2e/
    login.cy.js
    directory.cy.js
    recruitment.cy.js
  fixtures/
    candidates.json
  pages/
    DashboardPage.js
    DirectoryPage.js
    LoginPage.js
    RecruitmentPage.js
  support/
    commands.js
    e2e.js
    intercepts.js
```
