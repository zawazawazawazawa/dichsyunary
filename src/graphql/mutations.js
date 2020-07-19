/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createMemo = /* GraphQL */ `
  mutation CreateMemo(
    $input: CreateMemoInput!
    $condition: ModelMemoConditionInput
  ) {
    createMemo(input: $input, condition: $condition) {
      id
      memo
      date
      createdAt
      updatedAt
    }
  }
`;
export const updateMemo = /* GraphQL */ `
  mutation UpdateMemo(
    $input: UpdateMemoInput!
    $condition: ModelMemoConditionInput
  ) {
    updateMemo(input: $input, condition: $condition) {
      id
      memo
      date
      createdAt
      updatedAt
    }
  }
`;
export const deleteMemo = /* GraphQL */ `
  mutation DeleteMemo(
    $input: DeleteMemoInput!
    $condition: ModelMemoConditionInput
  ) {
    deleteMemo(input: $input, condition: $condition) {
      id
      memo
      date
      createdAt
      updatedAt
    }
  }
`;
export const createAlcohol = /* GraphQL */ `
  mutation CreateAlcohol(
    $input: CreateAlcoholInput!
    $condition: ModelAlcoholConditionInput
  ) {
    createAlcohol(input: $input, condition: $condition) {
      id
      beer
      highball
      sour
      date
      createdAt
      updatedAt
    }
  }
`;
export const updateAlcohol = /* GraphQL */ `
  mutation UpdateAlcohol(
    $input: UpdateAlcoholInput!
    $condition: ModelAlcoholConditionInput
  ) {
    updateAlcohol(input: $input, condition: $condition) {
      id
      beer
      highball
      sour
      date
      createdAt
      updatedAt
    }
  }
`;
export const deleteAlcohol = /* GraphQL */ `
  mutation DeleteAlcohol(
    $input: DeleteAlcoholInput!
    $condition: ModelAlcoholConditionInput
  ) {
    deleteAlcohol(input: $input, condition: $condition) {
      id
      beer
      highball
      sour
      date
      createdAt
      updatedAt
    }
  }
`;
