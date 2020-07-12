/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getMemo = /* GraphQL */ `
  query GetMemo($id: ID!) {
    getMemo(id: $id) {
      id
      memo
      date
      createdAt
      updatedAt
    }
  }
`;
export const listMemos = /* GraphQL */ `
  query ListMemos(
    $filter: ModelMemoFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listMemos(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        memo
        date
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getAlcohol = /* GraphQL */ `
  query GetAlcohol($id: ID!) {
    getAlcohol(id: $id) {
      id
      beer
      date
      createdAt
      updatedAt
    }
  }
`;
export const listAlcohols = /* GraphQL */ `
  query ListAlcohols(
    $filter: ModelAlcoholFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listAlcohols(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        beer
        date
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
