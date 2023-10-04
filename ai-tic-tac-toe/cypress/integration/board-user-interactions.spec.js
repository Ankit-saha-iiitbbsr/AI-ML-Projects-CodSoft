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

describe('Board user interactions', () => {

    beforeEach(() => {
        cy.visit('/')

        cy.get('body').invoke('addClass', 'animation--disabled')

        cy.get('[data-start-screen__player1-name]').type(player1.name)
        
        cy.get('[data-start-screen__player2-name]').type(player2.name)

        cy.get('[data-start-screen__form-setup] button').click()

        cy.get('#board-screen')
            .should('be.visible')
    })


    it('An empty cell must be clickable if the current player is human', () => {

        cy.get('[data-board-screen__board]')
            .should('have.class', 'board--human-turn')

        cy.get('.board__cell--empty')
            .first()
            .click()
            .should('not.have.class', 'board__cell--empty')
    })

    it('An empty cell must not be clickable if the current player is computer')

    it('Every empty cell must be clickable if the current player is human', () => {

        const cells = [ 0, 1, 2, 3, 4, 6, 5, 8, 7]

        cy.get('[data-board-screen__board]')
            .should('have.class', 'board--human-turn')

        cells.forEach(cell => {
            cy.get(`[data-board-screen__cell=${cell}]`)
                .should('have.class', 'board__cell--empty')
                .click()
                .should('not.have.class', 'board__cell--empty')
        });

    })

    it('If the current player is human, an empty clicked cell must change to the current player symbol', () => {

        cy.get('[data-board-screen__board]')
            .should('have.class', 'board--human-turn')
            .should('have.class', 'turn--X')

        cy.get('.board__cell--empty')
            .first()
            .click()
            .should('have.class', 'board__cell--X')

        cy.get('[data-board-screen__board]')
            .should('have.class', 'board--human-turn')
            .should('have.class', 'turn--O')

        cy.get('.board__cell--empty')
            .first()
            .click()
            .should('have.class', 'board__cell--O')
    })

    it('A filled cell must never be clickable')
    
    it('Should adapt board responsiveness if user resizes window', () => {
        // board size should always be the minor side of container

        const viewports = [
            {
                // se largura container menor igual que altura container
                width: 720,
                height: 1280
            },
            {
                // se largura container igual que altura container
                width: 490,
                height: 700
            },
            {
                // se largura container maior que altura container
                width: 1280,
                height: 720
            }
        ]

        viewports.forEach(viewport => {
            cy.viewport(viewport.width, viewport.height)
    
            cy.get('[data-board-screen__board-container]').invoke('width').then((containerWidth) => {
                cy.get('[data-board-screen__board-container]').invoke('height').then((containerHeight) => {
                    const boardSize = Math.min(containerWidth, containerHeight);
    
                    cy.get('[data-board-screen__board]')
                        .should('have.css', 'width', boardSize + 'px')
                        .should('have.css', 'height', boardSize + 'px')
                });
    
            });
        });


    })

})