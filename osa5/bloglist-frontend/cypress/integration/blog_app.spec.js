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
    })

    describe('When logged in', function() {
        beforeEach(function() {
            cy.get('#username').type('higo')
            cy.get('#password').type('supersalainen')
            cy.get('#login-button').click()
        })
    
        it('A blog can be created', function() {
            cy.contains('new blog').click()
            cy.get('#title').type('Cypress Blog')
            cy.get('#author').type('The Cypress Team')
            cy.get('#url').type('https://www.cypress.io/blog/')
            cy.get('#create-button').click()

            cy.contains('Cypress Blog')
        })

        describe('and a blog exists', function () {
            beforeEach(function () {
                cy.contains('new blog').click()
                cy.get('#title').type('The best posts about DevOps')
                cy.get('#author').type('Polar Squad')
                cy.get('#url').type('https://polarsquad.com/blog')
                cy.get('#create-button').click()
            })
      
            it('it can be liked', function () {
              cy.get('.list-view').find('button').click()
              cy.get('.detail-view').find('.like-button').click()

              cy.contains('likes 1')
            })
          })

          describe('and a blog is created', function () {
            beforeEach(function () {
                cy.contains('new blog').click()
                cy.get('#title').type('Blog post to be deleted')
                cy.get('#author').type('John Doe')
                cy.get('#url').type('https://test.com/blog')
                cy.get('#create-button').click()
            })
      
            it('it can be deleted', function () {
                cy.get('.list-view').find('button').click()
                cy.get('.detail-view').find('.remove-button').click()
                cy.get('html').should('not.contain', 'Blog post to be deleted')
            })
          })
    })

    // valuable lesson on operations done "past the UI" - only use this method or the UI only, mixing them is bad idea..
    describe('When several blog posts are created by logged-in user', function () {
        beforeEach(function () {
            cy.login({ username: 'higo', password: 'supersalainen' })
            cy.createBlog({ 
                title: 'Tech blog about public clouds and devops using MS stack.', 
                author: 'Masi Malmi',
                url: 'https://msdevopsdude.com',
                likes: 100
            })
            cy.createBlog({ 
                title: 'The best posts about DevOps', 
                author: 'Polar Squad',
                url: 'https://polarsquad.com/blog',
                likes: 1000
            })
            cy.createBlog({ 
                title: 'Cypress Blog', 
                author: 'The Cypress Team',
                url: 'https://www.cypress.io/blog/',
                likes: 500
            })
        })
  
        it('the one with most likes is ordered on top', function () {
            cy.get('.list-view:first')
                .should('contain', 'The best posts about DevOps')
        })
    })

  })