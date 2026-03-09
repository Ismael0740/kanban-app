import { input } from "@angular/core"

describe('Dashboard Tests', () => {

  beforeEach(() => {

    cy.visit('/login')

    cy.get('input[type="email"]').type('alexpinedoolivan@gmail.com')
    cy.get('input[type="password"]').type('123456')

    cy.contains('Entrar').click()

    cy.contains('Tableros Kanban')
  })

  it('Muestra la pantalla de tableros', () => {

    cy.contains('Tableros Kanban')
    cy.contains('Nuevo tablero')

  })

  it('Permite crear un tablero', () => {

    cy.contains('Crear el primero').click()
    cy.get('input[type="text"]').type('Tablero 1')

  })

  //it('Escribe nombre y crea', () => {

    
  //})

})