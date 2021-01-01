describe('Blog app', function() {
    beforeEach(function() {
        cy.request('POST', 'http://localhost:3001/api/testing/reset')
        const user = {
            name: 'Masahigo',
            username: 'higo',
            password: 'supersalainen'
        }
        cy.request('POST', 'http://localhost:3001/api/users/', user) 
        cy.visit('http://localhost:3000')
    })
  
    it('Login form is shown', function() {
        cy.get('h2')
            .should('contain', 'Log in to application')

        cy.get('#login-button')
            .should('contain', 'login')
            .and('have.attr', 'type', 'submit')

    })

    describe('Login',function() {
        it('succeeds with correct credentials', function() {
            cy.get('#username').type('higo')
            cy.get('#password').type('supersalainen')
            cy.get('#login-button').click()
    
            cy.contains('Masahigo logged in')
        })
    
        it('fails with wrong credentials', function() {
            cy.get('#username').type('higo')
            cy.get('#password').type('wrong')
            cy.get('#login-button').click()

            cy.get('html').should('not.contain', 'Masahigo logged in')
        })
    }
    )
  })