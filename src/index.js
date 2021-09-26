import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useQuery,
  HttpLink, 
  split,
  gql
} from "@apollo/client";
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';



const wsLink = new WebSocketLink({
  uri: 'wss://social-mastiff-52.hasura.app/v1/graphql',
  options: {
    reconnect: true,
    connectionParams: {headers: {'content-type': 'application/json',
                      'x-hasura-admin-secret':'ELYXTN4tPwENaAdmL3pQsVUB4aAG8D5jRTeJmOoKkZSq4tI6rYcR8LLWCSC1vygK'
  }}
  }
});

const httpLink = new HttpLink({
  uri: 'https://social-mastiff-52.hasura.app/v1/graphql',
  headers: {'content-type': 'application/json',
            'x-hasura-admin-secret':'ELYXTN4tPwENaAdmL3pQsVUB4aAG8D5jRTeJmOoKkZSq4tI6rYcR8LLWCSC1vygK'
          }
});

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink,
);

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: splitLink
});

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
