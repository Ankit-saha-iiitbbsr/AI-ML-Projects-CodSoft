/// <reference types="Cypress" />

const computer1 = {
    name: 'robot',
    type: 'COMPUTER',
    symbol: 'X',
}

const human1 = {
    name: 'gilmar',
    type: 'HUMAN',
    symbol: 'O',
}

const human2 = {
    name: 'beto',
    type: 'HUMAN',
    symbol: 'X',
}

function movePlayer(xCount, oCount) {
    cy.log(xCount, oCount)

    cy.get('[data-board-screen__board]').invoke('attr', 'class').then($boarClasses => {
        const currentPlayerType = $boarClasses.includes('board--human-turn') ? 'HUMAN' : ($boarClasses.includes('board--computer-turn')? 'COMPUTER' : '');
        const currentPlayerSymbol = $boarClasses.includes('turn--X') ? 'X' : ($boarClasses.includes('turn--O') ? 'O' : '')
        // const isRoundEnded = !$boarClasses.includes('turn--X') && !$boarClasses.includes('turn--O')
        const isRoundEnded = !currentPlayerSymbol
        cy.log('isRoundEnded?', isRoundEnded )
        cy.log('currentPlayerSymbol?', currentPlayerSymbol )
        cy.log('currentPlayerType?', currentPlayerType )

        if(!isRoundEnded) {
            if(currentPlayerType === 'HUMAN') {
                // human turn
                cy.get('[data-board-screen__board]')
                    .should('have.class', 'board--human-turn')
                    .should('have.class', 'turn--'+ currentPlayerSymbol)

                cy.get('.board__cell--empty')
                    .first()
                    .click()
                    .should('not.have.class', 'board__cell--empty')
                    .should('have.class', 'board__cell--' + currentPlayerSymbol).then(function() {
                        if(currentPlayerSymbol === 'X') {
                            ++xCount;
                        } else {
                            ++oCount;
                        }
                        movePlayer(xCount, oCount)
                    })
                    
            } else if(currentPlayerType === 'COMPUTER') {
                // computer  turn
                cy.get('[data-board-screen__board]')
                    .should('have.class', 'board--computer-turn')
                    .should('have.class', 'turn--'+ currentPlayerSymbol)
                    
                cy.get('[data-board-screen__board]')
                    // .should('have.class', 'board--human-turn')
                    .should('not.have.class', 'turn--'+ currentPlayerSymbol).then(function() {
                        if(currentPlayerSymbol === 'X') {
                            ++xCount;
                            cy.log('update x:', xCount)
                        } else {
                            ++oCount;
                            cy.log('update o:', oCount)
                        } 

                        
                        cy.get('.board__cell--' + currentPlayerSymbol)
                            .should('have.length', currentPlayerSymbol === 'X' ? xCount : oCount).then(function() {
                                movePlayer(xCount, oCount)
                            })
                    })

            }
        }
    })

}

describe('Player modes', () => {

    it('[human x human] If the round is not over, players must take turns', () => {
        cy.visit('/')

        cy.get('body').invoke('addClass', 'animation--disabled')

        cy.get('[data-start-screen__player1-name]').type(human1.name)
        
        cy.get('[data-start-screen__player2-name]').type(human2.name)

        cy.get('[data-start-screen__form-setup] button').click()
        // cy.get('#board-screen')
        //     .should('be.visible')

        movePlayer(0,0);
    })


    it('[computer x human] If the round is not over, players must take turns', () => {
        cy.visit('/')

        cy.get('body').invoke('addClass', 'animation--disabled')

        cy.get('[data-start-screen__preferences-computer-delay]').then(input => {
            input.val(0);
        });

        cy.get('[data-start-screen__game-mode]').select('COMPUTER,HUMAN')

        cy.get('[data-start-screen__player1-name]').type(computer1.name)
        
        cy.get('[data-start-screen__player2-name]').type(human1.name)

        cy.get('[data-start-screen__form-setup] button').click()

        // cy.get('#board-screen')
        //     .should('be.visible')

        movePlayer(0,0);
    })

    it('[human x computer] If the round is not over, players must take turns', () => {
        cy.visit('/')

        cy.get('body').invoke('addClass', 'animation--disabled')

        cy.get('[data-start-screen__preferences-computer-delay]').then(input => {
            input.val(0);
        });

        // cy.get('[data-start-screen__preferences-computer-delay]').clear().type('0')

        cy.get('[data-start-screen__game-mode]').select('HUMAN,COMPUTER')

        cy.get('[data-start-screen__player1-name]').type(human1.name)
        
        cy.get('[data-start-screen__player2-name]').type(computer1.name)

        cy.get('[data-start-screen__form-setup] button').click()

        // cy.get('#board-screen')
        //     .should('be.visible')

        movePlayer(0,0);
    })
    
    // it.skip('computer x computer')
})

context('Computer player delay', () => {
    beforeEach(() => {
        cy.visit('/')

        cy.get('body').invoke('addClass', 'animation--disabled')

        cy.get('[data-start-screen__game-mode]').select('COMPUTER,HUMAN')

        cy.get('[data-start-screen__player1-name]').type(computer1.name)
        
        cy.get('[data-start-screen__player2-name]').type(human1.name)

        cy.get('[data-start-screen__form-setup] button').click()

    })

    it('If the player is type computer, his move should have a delay', ()  => {

        cy.get('#board-screen')
            .should('be.visible')

        cy.get('[data-board-screen__board]')
            // .should('not.have.class', 'board--human-turn')
            .should('have.class', 'board--computer-turn')
            .should('have.class', 'turn--X')

        // verificar se o nome do player atual está correto no hint 
        cy.get('[data-board-screen__hint]')
            .should('contain.text', computer1.name + ':')

        // wait computer move 
        cy.get('[data-board-screen__board]')
            .should('have.class', 'board--human-turn')
            .should('have.class', 'turn--O')
        cy.get('.board__cell--X')
            .should('have.length', 1)

        // verificar se o nome do player atual está correto no hint 
        cy.get('[data-board-screen__hint]')
            .should('contain.text', human1.name + ':')
    
    })

    it('If user preference disabled computer delay, computer moves should not have a delay')

})