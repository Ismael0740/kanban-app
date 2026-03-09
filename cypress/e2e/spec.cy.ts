describe('Login Page Tests', () => {

  beforeEach(() => {
    cy.visit('http://localhost:4200/login')
  })

  it('La página de login carga correctamente', () => {
    cy.contains('Iniciar sesión')
  })

  it('El formulario tiene los campos necesarios', () => {
    cy.get('input[type="email"]').should('exist')
    cy.get('input[type="password"]').should('exist')
    cy.get('button').contains('Entrar').should('exist')
  })

  it('Permite escribir en los campos', () => {
    cy.get('input[type="email"]').type('alexpinedoolivan@gmail.com')
    cy.get('input[type="password"]').type('123456')

    cy.get('input[type="email"]').should('have.value', 'alexpinedoolivan@gmail.com')
    cy.get('input[type="password"]').should('have.value', '123456')
  })

  it('Hace click en el botón entrar', () => {
    cy.get('input[type="email"]').type('alexpinedoolivan@gmail.com')
    cy.get('input[type="password"]').type('123456')

    cy.get('button').contains('Entrar').click()
  })

})