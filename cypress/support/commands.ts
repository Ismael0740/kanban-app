Cypress.Commands.add('login', () => {

  cy.session('user-session', () => {

    cy.visit('/login')

    cy.get('input[type="email"]').type('alexpinedoolivan@gmail.com')
    cy.get('input[type="password"]').type('123456')

    cy.contains('Entrar').click()

    cy.contains('Tableros Kanban')

  })

})

declare global {
  namespace Cypress {
    interface Chainable {
      login(): Chainable<void>
    }
  }
}

export {}