describe('Note app', function() {
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

      it('then example', function() {
        cy.get('button').then( buttons => {
          console.log('number of buttons', buttons.length)
          cy.wrap(buttons[0]).click()
        })
      })
    
    it('front page can be opened', function() {
      //cy.visit('http://localhost:3000')
      cy.contains('Notes')
      //cy.contains('Note app, Department of Computer Science, University of Helsinki 2020')
    })

    it('user can login', function() {
        //cy.visit('http://localhost:3000')
        cy.contains('login').click()
        //cy.get('input:first').type('higo')
        //cy.get('input:last').type('supersalainen')
        cy.get('#username').type('higo')
        cy.get('#password').type('supersalainen')
        cy.get('#login-button').click()

        cy.contains('Masahigo logged in')
      })

      it('login fails with wrong password', function() {
        cy.contains('login').click()
        cy.get('#username').type('higo')
        cy.get('#password').type('wrong')
        cy.get('#login-button').click()
    
        //cy.contains('wrong credentials')
        //cy.get('.error').contains('wrong credentials')
        /*cy.get('.error').should('contain', 'wrong credentials') 
        cy.get('.error').should('have.css', 'color', 'rgb(255, 0, 0)')
        cy.get('.error').should('have.css', 'border-style', 'solid')*/
        cy.get('.error')
            .should('contain', 'wrong credentials')
            .and('have.css', 'color', 'rgb(255, 0, 0)')
            .and('have.css', 'border-style', 'solid')

        cy.get('html').should('not.contain', 'Masahigo logged in')
      })
    
      describe('when logged in', function() {
        beforeEach(function() {
          /*cy.contains('login').click()
          cy.get('#username').type('higo')
          cy.get('#password').type('supersalainen')
          cy.get('#login-button').click()*/
          cy.login({ username: 'higo', password: 'supersalainen' })
        })
    
        it('a new note can be created', function() {
          /*cy.contains('new note').click()
          cy.get('input').type('a note created by cypress')
          cy.contains('save').click()*/
          cy.createNote({
            content: 'a note created by cypress',
            important: true
          })
          cy.contains('a note created by cypress')
        })

        describe('and a note exists', function () {
            beforeEach(function () {
              /*cy.contains('new note').click()
              cy.get('input').type('another note cypress')
              cy.contains('save').click()*/
              cy.createNote({
                content: 'another note cypress',
                important: false
              })
            })
      
            it('it can be made important', function () {
              /*cy.contains('another note cypress')
                .contains('make important')
                .click()
      
              cy.contains('another note cypress')
                .contains('make not important')*/
              cy.contains('another note cypress').parent().find('button').as('theButton')
              cy.get('@theButton').click()
              cy.get('@theButton').should('contain', 'make not important')
            })
          })
        
          describe('and several notes exist', function () {
            beforeEach(function () {
              cy.createNote({ content: 'first note', important: false })
              cy.createNote({ content: 'second note', important: false })
              cy.createNote({ content: 'third note', important: false })
            })
        
            it('two of those can be made important', function () {
              /*cy.contains('second note')
                .contains('make important')
                .click()
        
              cy.contains('second note')
                .contains('make not important')*/
              // tapa 1
              cy.contains('second note').parent().find('button').click()
              cy.contains('second note').parent().find('button')
                .should('contain', 'make not important')
              // tapa 2
              cy.contains('third note').parent().find('button').as('theButton')
              cy.get('@theButton').click()
              cy.get('@theButton').should('contain', 'make not important')
            })
          })

      })
    
  })