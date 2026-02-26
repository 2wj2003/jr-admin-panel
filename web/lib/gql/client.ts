import { getApiUrl } from '@lib/api/get-url';
import { GraphQLClient } from 'graphql-request';

export const getClient = () => {
  const host = getApiUrl();

  return new GraphQLClient(host + '/graphql');
};
