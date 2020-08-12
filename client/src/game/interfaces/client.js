import { ApolloClient, InMemoryCache } from '@apollo/client';

import { gql } from '@apollo/client';

/* ----- Apollo Configuration ----- */

export const client = new ApolloClient({
    uri: 'http://localhost:4000/graphql/',
    cache: new InMemoryCache()
});

export const policy = (identifier) => ({
    fetchPolicy: "network-only",
    variables: {
        "identifier" : identifier
    }
});

export const GraphQL = Object.freeze({
    Mutation : {
        Initialize : gql`
            mutation initialize($settings: Settings!) {
                initialize(settings: $settings)
            }`,
        Surrender : gql`
            mutation surrender($identifier: String!) {
                surrender(identifier: $identifier) {
                    status,
                    word
                }
            }`,
        Validate : gql`
            mutation validate($guess: Guess!) {
                validate(guess: $guess) {
                    result {
                        guess,
                        ones,
                        twos
                    }
                    end {
                        status,
                        word
                    }
                }
            }`
    },
    Query: {
        User : gql`
            query user($identifier: String!) {
                user(identifier: $identifier)
            }`,
        Progress : gql`
            query progress($identifier: String!) {
                progress(identifier: $identifier)
            }`,
        History : gql`
            query history($identifier: String!) {
                history(identifier: $identifier) {
                    guess,
                    ones,
                    twos
                }
            }`
    }
});