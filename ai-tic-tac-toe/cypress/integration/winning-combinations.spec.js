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

const tests = [
    {
        name: 'X wins: [ 0, 1, 2 ]',
        xMoves: [ 0, 1, 2 ],
        oMoves: [ 3, 4 ],
        winner: player1.name
    },
    {
        name: 'O wins: [ 3, 4, 5 ]',
        xMoves: [ 0, 6, 1 ],
        oMoves: [ 3, 4, 5 ],
        winner: player2.name
    },
    {
        name: 'X wins: [ 6, 7, 8 ]',
        xMoves: [ 6, 7, 8 ],
        oMoves: [ 3, 4 ],
        winner: player1.name
    },
    {
        name: 'O wins: [ 0, 3, 6 ]',
        xMoves: [ 1, 2, 8 ],
        oMoves: [ 0, 3, 6 ],
        winner: player2.name
    },
    {
        name: 'X wins: [ 1, 4, 7 ]',
        xMoves: [ 1, 4, 7 ],
        oMoves: [ 0, 3 ],
        winner: player1.name
    },
    {
        name: 'O wins: [ 2, 5, 8 ]',
        xMoves: [ 0, 4, 7 ],
        oMoves: [ 2, 5, 8 ],
        winner: player2.name
    },
    {
        name: 'X wins: [ 0, 4, 8 ]',
        xMoves: [ 0, 4, 8 ],
        oMoves: [ 1, 7 ],
        winner: player1.name
    },
    {
        name: 'O wins: [ 2, 4, 6 ]',
        xMoves: [ 0, 5, 8 ],
        oMoves: [ 2, 4, 6 ],
        winner: player2.name
    },
]

describe('Winning combinations', () => {

    beforeEach(() => {
        cy.visit('/')

        cy.get('body').invoke('addClass', 'animation--disabled')

        cy.get('[data-start-screen__player1-name]').type(player1.name)
        
        cy.get('[data-start-screen__player2-name]').type(player2.name)

        cy.get('[data-start-screen__form-setup] button').click()

        cy.get('#board-screen')
            .should('be.visible')
    })

    tests.forEach(test => {
        it(test.name, () => {

            for(let i = 0; i < Math.max(test.xMoves.length, test.oMoves.length); i++) {
                if(test.xMoves[i] !== undefined) {
                    cy.get(`[data-board-screen__cell=${test.xMoves[i]}]`).click()
                }
                if(test.oMoves[i] !== undefined){
                    cy.get(`[data-board-screen__cell=${test.oMoves[i]}]`).click()
                }
            }

            cy.get('#end-round-screen')
                .should('be.visible')

            cy.get('[data-end-round-screen__text]')
                .should('contain', test.winner)
        })
    });

})