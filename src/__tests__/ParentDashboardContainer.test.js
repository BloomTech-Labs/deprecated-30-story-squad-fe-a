import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { render, cleanup, waitFor } from '@testing-library/react';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';

import { ParentLoadingComponent } from '../components/common';
import ParentDashboardContainer from '../components/pages/ParentDashboard/ParentDashboardContainer';

const mockStore = configureStore([]);
const store = mockStore();

afterEach(cleanup);

jest.mock('@okta/okta-react', () => ({
  useOktaAuth: () => {
    return {
      authState: {
        isAuthenticated: true,
      },
      authService: {
        getUser: () => Promise.resolve({ name: 'someone' }),
      },
    };
  },
}));

describe('<ParentDashboardContainer /> test suite', () => {
  test('container renders without crashing', async () => {
    const { getByText, findByText, queryByText } = render(
      <Router>
        <Provider store={store}>
          <ParentDashboardContainer LoadingComponent={ParentLoadingComponent} />
        </Provider>
      </Router>
    );
    let loader = getByText(/loading/i);
    expect(loader).toBeInTheDocument();

    //   await waitFor(async () => {
    //     await findByText(/welcome/i);
    //   });
    //   loader = queryByText(/loading/i);
    //   expect(loader).toBeNull();
  });
});

// import * as React from 'react';
// import { configure, shallow } from 'enzyme';
// import Adapter from 'enzyme-adapter-react-16';
// import { BrowserRouter as Router } from 'react-router-dom';

// import configureStore from 'redux-mock-store';
// import { Provider } from 'react-redux';

// import LoadingComponent from '../components/common/ParentLoadingComponent';
// import RenderParentDashboard from '../components/pages/ParentDashboard/RenderParentDashboard';
// import ParentDashboardContainer from '../components/pages/ParentDashboard/ParentDashboardContainer';
// jest.mock('@okta/okta-react', () => ({
//   useOktaAuth: () => {
//     return {
//       authState: {
//         isAuthenticated: true,
//       },
//       authService: {},
//     };
//   },
// }));

// configure({ adapter: new Adapter() });

// describe('<ParentDashboardContainer />', () => {
//   configure({ adapter: new Adapter() });
//   const mockStore = configureStore([]);
//   const store = mockStore();

//   describe('Render <ParentDashboardContainer />', () => {
//     let shallowWrapper;
//     beforeEach(() => {
//       shallowWrapper = shallow(
//         <Router>
//           <Provider store={store}>
//             <ParentDashboardContainer />
//           </Provider>
//         </Router>
//       ).dive();
//     });

//     it('Find ParentDashboard', () => {
//       expect(shallowWrapper.find(RenderParentDashboard));
//     });
//     it('Find Loading Component', () => {
//       expect(shallowWrapper.find(LoadingComponent));
//     });
//     it('Find ParentDashboardContainer', () => {
//       expect(shallowWrapper).toMatchSnapshot();
//     });
//   });
// });
