# Testing React Components

**Lesson Duration**: 45 minutes

### Learning Objectives

- Understand what Cypress is and how to use it
- Be able to perform e2e testing on ui components

## Testing the UI.

Using the same code from the last lesson we are going to run End to End tests on our application. 

End to End Testing, or UI testing is one the many approaches for testing a web application.

An end to end test checks whether a web application works as expected or not, by testing the so called "user flow".

To do this we are going to use a tool called Cypress.

## Installing Cypress

Cypress is an E2E testing framework that allows us to quickly test anything that runs in a browser.

> In the terminal run the command `npm install -D cypress`.


> Important Note: Run Cypress and following commands from the Mac Terminal. *NOT* from the VS Code integrated terminal. VS Code doesn't have the necessary permissions to install Cypress. 

Once that is installed we will add a new script command to our `package.json` to open the Cypress test suite.

```js
// package.json
"scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject",
    "test:e2e": "cypress open" // ADDED
  },
```

And run this command in the Mac terminal: `npm run test:e2e`.

> Note it may ask you to download the Cypress software.
>
> Trouble Shooting: Try uninstalling and reinstalling Cypress
>
> `npm uninstall cypress`
>
> `npm install -D cypress`


When we run this it starts up what is known as the `Cypress test Runner`. It may show some start up tips but we can close this. This is where we will spend the majority of our time testing.

This will also add a new `cypress` folder to the root of our application. In here there is a folder called `integration` with some sample test files. We can delete these all:

```bash
# terminal

rm -rf cypress/integration/*.*
```

 Let's replace these with a new file. Like reacts test library, cypress will look inside the integration folder for test files with a `.spec.js` extension.

 ```bash
 # terminal 

touch cypress/integration/app.spec.js cypress/integration/app.spec.js
 ```

In order for these to work we will need to start our React app so that Cypress can go to the app in the browser. 

Open a new terminal window and run the following:

```bash
# terminal
npm start
```

Open one more terminal and open our server as well for this part. Normally you would have a test server with separate data but this will do for us just now. 

```bash

cd server
npm i 
npm run server:dev
```
(Note you may have to create a sightings database and re-run the SQL file on it)

## Testing UI 

If you go back to the Cypress test suite you will see our test files listed. 

What we want to do here is go to our apps url and start to automate some UI interaction. 

In order for Cypress to be able to interact with the browser it gives us access to an object straight out of the box called `cy`. 

`cy` comes with some great functions to allow us to do this. 

The first thing we want to do is visit our app in chrome. 

To do this we will use `cy.visit()`.

As we are running our app the route we will hit is simply `http://localhost:3000`.

```js
// app.spec.js

describe('App', () => {
  
  beforeEach(() => {
    cy.visit('http://localhost:3000')
  }) // ADDED
  
})
```

Next lets a test. We will test that our sightings are showing in the browser again. 

Let's make sure that we can access the h1 elements and test they have been rendered properly. 

To do this we again need to query the DOM to get our h1's. Cypress makes this easier to access using an in-built `get` method available through `cy`. This works just like the `querySelector` from vanilla JS so we can get elements by type, id or class as usual.


```js
// app.spec.js

 describe('App', () => {

  beforeEach(() => {
    cy.visit('http://localhost:3000')
  })
  
   it('should be able to load app', () => {
      const allSightingHeaders = cy.get('h1');
    });

})
```

If you go back to the cypress suite and click on the `app.spec.js` file it will open a chrome window. In here it will show a pane on the right listing our tests and the results and on the right a browser window. 

Now that we have the H1 we can check that it contains the correct text. Again this is a bit different to reacts testing tools. Cypress gives us a `should` method that we can pass in 2 arguments. The first is the condition and 2nd is the value.

Some conditions we can use are:

- eq
- match
- contain

We can also chain these together like:

- be.empty
- be.visible
- have.class

And a whole host of others documented [here](https://docs.cypress.io/api/commands/should.html#Value)

We will use `contain` and check that the frist h1 contains the right sighting species.

```js
// app.spec.js

describe('App', () => {

  beforeEach(() => {
    cy.visit('http://localhost:3000')
  })
  
   it('should be able to load app', () => {
      const allSightingHeadings = cy.get('h1');
      allSightingHeadings[0].should('contain', 'Yellow Wagtail');
    });

})
```

If we go back to the cypress chrome window we should now see that our test has ran and it should have passed! 

## Further testing in Cypress.

We will now do some more testing of the apps section of our app. 

But we don't want to have to interact with the UI to get the tests passing. We want Cypress to automate that!

First we will test that Submitting the form will add a new sighting. In order to do this we will need access to the `form` element inputs. Each input has an id so we can access them using that. We can then call an in-build Cypress method called `type` to ernter text. Then access the form and `submit`. 

Then we will get our h1's back and make sure that one of them contains the word Pidgeon. 

```js
// app.spec.js

 describe('App', () => {

  beforeEach(() => {
    cy.visit('http://localhost:3000')
  })

  it('should be able to add a sighting', () => {
      cy.get('#species').type("Pidgeon");
      cy.get('#location').type("Glasgow");
      cy.get('#date').type("2022-04-15");
      cy.get('#sightings-form').submit();
      const headings = cy.get('h1');
      headings.should('contain', "Pidgeon");
    });

})
```

If the app has loaded successfully we should have extra sightings. 


Now if we go back to the Cypress test suite and click the app.spec.js file it will run that test in a new browser window. 

Awesome! We have successfully tested that our sighting list is populated.

A list of interactions with elements can be found [here](https://docs.cypress.io/guides/core-concepts/interacting-with-elements.html#Actionability)

## But tell me why?!

But we can see this in the browser and know it works why am I testing this???

Well you won't always see this browser for a start. When you automate deployment no one is going to sit and watch the browser and make sure. We rely on the tests to make sure it has happened. Also later on you may change something elsewhere and the tests make sure that nothing breaks as a result. You can also test multiple scenarios very quickly. 

## Recap

<br/>
Which method do we call to get an element back from the DOM?

<details>
<summary>Answer</summary>
`cy.get`
</details>

## Conclusion

Now that we can test our React UI components the world really is our oyster!

No more will UI testers have to click countless buttons and fill in numerous forms manually saving time for that extra cup of coffee! 

