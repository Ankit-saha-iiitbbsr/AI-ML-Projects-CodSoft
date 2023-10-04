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

const rounds = [
    {
        xMoves: [ 0, 2, 4, 5, 7 ],
        oMoves: [ 1, 3, 6, 8 ],
    },
    {
        xMoves: [ 3, 7, 5 ],
        oMoves: [ 0, 1, 2 ],
    },
    {
        xMoves: [ 0, 2, 4, 5, 7 ],
        oMoves: [ 1, 3, 6, 8 ],
    }
];

describe('End game screen', () => {

    before(() => {
        cy.visit('/')

        cy.get('body').invoke('addClass', 'animation--disabled')

        cy.get('[data-start-screen__player1-name]').type(player1.name)
        
        cy.get('[data-start-screen__player2-name]').type(player2.name)

        cy.get('[data-start-screen__form-setup] button').click()


        rounds.forEach((round, index) => {
            // Should show start round alert
            cy.get('#round-screen')
                .should('have.class', 'screen--show')
                .and('have.class', 'animating')

            cy.get('#round-screen').contains(`Round ${index + 1}/`)

            cy.get('#board-screen')
                .should('be.visible')

            for(let i = 0; i < Math.max(round.xMoves.length, round.oMoves.length); i++) {
                if(round.xMoves[i] !== undefined) {
                    cy.get(`[data-board-screen__cell=${round.xMoves[i]}]`).click()
                }
                if(round.oMoves[i] !== undefined){
                    cy.get(`[data-board-screen__cell=${round.oMoves[i]}]`).click()
                }
            }
    
            // TODO if animations are not disabled, the wait is necessary to test success
            // cy.wait(5000);
            
        });


    })

    it('Should show End Game Screen if current round exceeds maxRouds config', () => {
    
        // end game screen should be visible
        cy.get('#start-screen')
            .should('not.have.class', 'screen--show')

        cy.get('#round-screen')
            .should('not.have.class', 'screen--show')
            .and('not.have.class', 'animating')

        cy.get('#board-screen')
            .should('not.have.class', 'screen--show')

        cy.get('#end-round-screen')
            .should('not.have.class', 'screen--show')
            .should('not.have.class', 'animating')

        cy.get('#end-game-screen')
            .should('have.class', 'screen--show')

        cy.get('[data-end-game-screen__score]')
            .children()
            .first()
            .should('contain.text', `Rounds: ${rounds.length}`)
            .next()
            .should('contain.text', `${player1.name} (${player1.symbol}): 0`)
            .next()
            .should('contain.text', `${player2.name} (${player2.symbol}): 1`)
            .next()
            .should('contain.text', 'Draws: 2')
    })

    it('Should show Start Game Screen if user clicks restart', () => {
        cy.get('#end-game-screen')
            .should('be.visible')
        
        cy.get('[data-end-game-screen__restart]').click()


        cy.get('#start-screen')
            .should('have.class', 'screen--show')

        cy.get('#round-screen')
            .should('not.have.class', 'screen--show')
            .and('not.have.class', 'animating')

        cy.get('#board-screen')
            .should('not.have.class', 'screen--show')

        cy.get('#end-round-screen')
            .should('not.have.class', 'screen--show')
            .should('not.have.class', 'animating')

        cy.get('#end-game-screen')
            .should('not.have.class', 'screen--show')
    })

})