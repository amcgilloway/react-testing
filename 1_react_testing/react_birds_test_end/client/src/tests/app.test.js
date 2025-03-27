import {render, fireEvent, waitFor} from '@testing-library/react';
import App from '../App.js';

describe('App Component', () => {

    let container;
    
    beforeEach(() => {

      jest.spyOn(global.console, 'error').mockImplementation((message) => {
        if (!message.includes('wrapped in act')) {
            global.console.warn(message);
        }
      });

      const mockSuccessResponse = [{species: "Pidgeon", location: "Glasgow", date: "2022-04-15"}];
      const mockJsonPromise = Promise.resolve(mockSuccessResponse);
      const mockFetchPromise = Promise.resolve({json: () => mockJsonPromise});

      jest.spyOn(global, 'fetch').mockImplementation(() => mockFetchPromise);


      container = render(<App />)
    });


    test('loads and displays a sighting', () => {
      expect(container.getByTestId('heading')).toHaveTextContent('Pidgeon');
      expect(container.getByTestId('location')).toHaveTextContent('Glasgow');
      expect(container.getByTestId('date')).toHaveTextContent('2022-04-15');
    });

    test('can delete sighting', async () => {
      const deleteButton = container.getByTestId('delete');
      fireEvent.click(deleteButton);
      await waitFor(() => {
        expect(container.queryByText('Pidgeon')).not.toBeInTheDocument();
      })  
      
    });

});
