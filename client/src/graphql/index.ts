import { ApolloClient, ApolloLink, createHttpLink, from, InMemoryCache } from '@apollo/client/core'
import { createApolloProvider } from '@vue/apollo-option'

// Removes __typename from apollo response objects
const cleanTypesLink = new ApolloLink((operation, forward) => {
    if (operation.variables) {
        const omitTypename = (key, value) => (key === '__typename' ? undefined : value);
        operation.variables = JSON.parse(JSON.stringify(operation.variables), omitTypename);
    }
    return forward(operation).map((data) => {
        return data;
    });
});

// HTTP connection to the API
const httpLink = createHttpLink({
    // You should use an absolute URL here
    uri: '/graphql',
})

const additiveLink = from([
    cleanTypesLink,
    httpLink,
])

// Cache implementation
const cache = new InMemoryCache()

// Create the apollo client
export const apolloClient = new ApolloClient({
    link: additiveLink,
    cache,
})

export const apolloProvider = createApolloProvider({
        defaultClient: apolloClient,
    }
)