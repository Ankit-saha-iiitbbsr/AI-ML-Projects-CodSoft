/// <reference types="Cypress" />

const player1 = {
    name: 'gilmar',
    type: 'HUMAN',
    symbol: 'X',
}
const player2 = {
    name: 'jorge',
    type: 'HUMAN',
    symbol: 'O',
}

describe('Board Screen', () => {
    before(() => {
        cy.visit('/')

        cy.get('body').invoke('addClass', 'animation--disabled')

        cy.get('[data-start-screen__player1-name]').type(player1.name)
            
        cy.get('[data-start-screen__player2-name]').type(player2.name)

        cy.get('[data-start-screen__form-setup] button').click()
    })

    it('Should show Board Screen', () => {
        cy.get('#start-screen')
            .should('not.have.class', 'screen--show')

        cy.get('#round-screen')
            .should('not.have.class', 'screen--show')
            .and('not.have.class', 'animating')

        cy.get('#board-screen')
            .should('have.class', 'screen--show')

        cy.get('#end-round-screen')
            .should('not.have.class', 'screen--show')
            .should('not.have.class', 'animating')

        cy.get('#end-game-screen')
            .should('not.have.class', 'screen--show')

        
        cy.get('#board-screen')
            .should('be.visible')

    })

    it('Must be player 1\'s turn', () => {
        cy.get('[data-board-screen__hint]')
            .should('contain.text', player1.name + ':')

        cy.get('[data-board-screen__board]')
            .should('have.class', 'turn--X')
    })

    it('Should display scores', () => {
        cy.get('[data-board-screen__score]')
            .children()
            .first()
            .should('contain.text', 'Round: 1/')
            .next()
            .should('have.text', `${player1.name} (${player1.symbol}): 0`)
            .next()
            .should('have.text', `${player2.name} (${player2.symbol}): 0`)
            .next()
            .should('have.text', 'Draws: 0')
    })

    it('Should display empty board', () => {
        cy.get('.board__cell')
            .should('have.length', 9)
            .should('have.class', 'board__cell--empty')
            .should('not.have.class', 'board__cell--highlight')
            .should('not.have.class', 'board__cell--X')
            .should('not.have.class', 'board__cell--O')
            .first()
            .should('have.attr', 'data-board-screen__cell', 0)
            .next()
            .should('have.attr', 'data-board-screen__cell', 1)
            .next()
            .should('have.attr', 'data-board-screen__cell', 2)
            .next()
            .should('have.attr', 'data-board-screen__cell', 3)
            .next()
            .should('have.attr', 'data-board-screen__cell', 4)
            .next()
            .should('have.attr', 'data-board-screen__cell', 5)
            .next()
            .should('have.attr', 'data-board-screen__cell', 6)
            .next()
            .should('have.attr', 'data-board-screen__cell', 7)
            .next()
            .should('have.attr', 'data-board-screen__cell', 8)
    })
})