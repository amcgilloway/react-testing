# Testing React Components

**Lesson Duration**: 60 minutes

### Learning Objectives

- Understand what React Testing Library is and how to use it
- Be able to unit test properties and methods.

## Intro

Over the next 2 lessons we are going to learn how to test React components.

We will test in 2 ways:

- Unit testing - Test our components and functions work properly.
- e2e testing - Test the full app to make sure it renders correctly in the browser.

Testing in this way will increase confidence in the code that you write and for a lot of development teams it is a requirement. It also ensures that any changes made to the code won't break anything as the tests are normally ran before any build is released.

### Unit testing with React Testing Tools.

We will be using a library called `React testing Library` for our unit tests. It can be used in conjunction with `Jest` to test API calls, mockups and UI components. (Note: that can also be used without Jest)

From Jest, we'll be using the methods:

`describe`: to groups related tests.

`beforeEach`: which will run before each test. 

`test`: to describe the test itself. It takes in the name of the test and a function that perfroms the actual test.

`expect...toEqual`: the condition that the test needs to pass. Jest has further methods used to compare our expected result.

React Testing Library is a DOM testing library, which means that instead of dealing with instances of rendered React components, it handles DOM elements and how they behave in front of real users.

This will provide other methods which we'll see in the following section.


## Creating our first test

> Download and open the start point and do an `npm install`. 
>
>**Do this in a Mac Terminal. Running this in a VSCode Terminal may lead to problems.**

Start the app and have a look at it in the browser. 

The app we will be testing in this lesson is our sightings code from earlier.

> Stop the server.

Next we would need to install React Testing Library.

>**These are already part of our start code, so we don't need to do this now.**

```bash
npm install -D  @testing-library/react@12.1.5

```

We will create a `tests` folder in the `src` folder as well and create an `App.test.js`. This naming convention is important. When we run the script `npm test`, React will look in our tests folder for files with a `.test.js` or `.spec.js` extension. This is how it knows which test files to run.

```bash
mkdir src/tests
touch src/tests/App.test.js
```

In `App.test.js` we will import a few things.

```js
// Counter.test.js

import {render, fireEvent, waitFor} from '@testing-library/react';
import App from '../App.js';


```

Here we are importing React as usual along with the component we want to test. But we are also importing a couple of methods from the React Testing Library as well. `render` is what we will use to essentially mount the component so that we can access DOM nodes like we would normally in a browser. 

`fireEvent` will allow us to trigger an event on a DOM element later and waitFor will allow us to wait for changes to the DOM.

To start with we will  mount our App component in a `beforeEach` block so that we are sure the component is fresh for each test. 

`render` returns us a `Reactcontainer` with a number of useful methods to use in our tests which we will look at throughout this lesson. To render our component we pass in `JSX` like we normally do in our React components.


```js
// App.test.js
import {render, fireEvent, waitFor} from '@testing-library/react';
import App from '../App.js';

describe('App Component', () => {

    let container;
    
    beforeEach(() => {

      container = render(<App />)

    });
```

Now.... we have an issue. When we render the App component it will try to trigger a fetch request to our API to get all sightings. We may not have the server running in our test environment. Alsdo we don't want to work with the live production data. 

What we can do instead is use Jest to spy on our component and when a fetch and it's promises are triggerd mock responses to send us back mock promises and data.

We will need to mock the following promises: 

1. The promise returned from fetch
2. The promise to get a response object with a `json` function
3. The promise to get the actual data. 

Again we will do this in our `beforeEach` block. 

(Note that there is a weird error that React throws up when we try to call functions that effectively change the state of the component. We will effectively be ignoring this message in the first part of the following code as there is no ideal way of dealing with it.)

```js
// App.test.js

describe('App Component', () => {

    let container;
    
    beforeEach(() => {

      jest.spyOn(global.console, 'error').mockImplementation((message) => {
        if (!message.includes('wrapped in act')) {
            global.console.warn(message);
        }
      });

      const mockSuccessResponse = [{species: "Pidgeon", location: "Glasgow", date: "2022-04-15"}]; // Mock the data from final promise
      const mockJsonPromise = Promise.resolve(mockSuccessResponse); // Mock the promise of response with json method
      const mockFetchPromise = Promise.resolve({json: () => mockJsonPromise}); // Mock the fetch promise

      jest.spyOn(global, 'fetch').mockImplementation(() => mockFetchPromise); // Spy on the fetch method and when called use our mocked promise. 


      container = render(<App />)
    });
```

## Testing DOM elements.

Take a while to have a look at the code in the project. It is an application with a few moving parts that we will be testing. There is a form to enter a new sighting and a list of all sightings returned. We will be testing the different components in slightly different ways to give you a broad overview of the testing strategies.

Take a particular look at the `App.js` file in the `src` folder.

## Knowing what to unit test

The most common question about unit testing components is "what exactly should I test?"

For unit testing we will test the methods that we have written and their effect on the data.

For end to end testing we will test the events and the effect on what is rendered in the UI.

We should always start here by identifying the business logic in our app.

For just now for `App.js` we will check:

Unit Tests:

- It should start with our Pidgeon displayed in the list.
- It should be able to delete a sighting

## Setting up a unit test

So complete the first test. 

We will check that the Pidgeon shows.

Unfortunately with React hooks such as useState, we are unable to directly access the state from our tests. We can only access the DOM elements. But that is OK. As long as our app works we should have an `h1` with text content of "Pidgeon".

Lets get access to that DOM element. (Similarly to how we did it with querySelector!)

To do this the React testing library container gives us a method called `findByTestId()`. 

We will need to add a test id to our h1 to be able to find this... we will also add ones to the delete button as well.

```html
<!-- SightingCard.js -->

return (
        <>
            <h1 data-testid="heading">{sighting.species}</h1>
            .... AS BEFORE
            <button data-testid="delete" onClick={handleDelete}> 🗑 </button>
            <hr></hr>
        </>
```

Now we can search for the h1 using this id. 


```js
// App.test.js

describe('Counter', () => {
 //AS BEFORE 

   test('loads and displays a sighting', () => {
      expect(container.getByTestId('heading')).toHaveTextContent('Pidgeon');
    });
    
})

```


If we run npm test in our terminal now we should see that the test is passing. It has found our h1, the mock data has been passed so this contains the text `Pidgeon`.

## Testing events

Next we will test that it can delete a sighting. 

Again we will find the delete button by it's test id. Then we will use `fireEvent` to trigger a click event on the button. Lastly we will tell our expect to wait for the update to the DOM before asserting the sighting isn't there anymore. 

```js
// App.test.js

test('can delete sighting', async () => {
      const deleteButton = container.getByTestId('delete');
      fireEvent.click(deleteButton);
      await waitFor(() => {
        expect(container.queryByText('Pidgeon')).not.toBeInTheDocument();
      })  
      
    });
    
```


And now let's run `npm test` in terminal again.

Awesome our tests are passing!


And that is us! We can test any event and the effect that it has on the state of our component.

Ideally we should be testing that our state is set correctly initially and any methods we write that will modify the data or DOM components.

Next we will look at e2e testing to make sure that our UI is displayed correctly.

## Recap

What are some of the advantages of testing?

<details>
<summary>Answer</summary>
Tests help a developer think about how to design a component, or refactor an existing component, and are often run every time code is changed. It also instils confidence in your code.
</details>

<br />

## Conclusion

Now that we can test our React components there is no stopping us!

A good mindset to have when testing components is to assume a test is necessary until proven otherwise.

Here are the questions you can ask yourself:

- Is this part of the business logic?
- Does this directly test the inputs and outputs of the component?
- Is this testing my code, or third-party code?
