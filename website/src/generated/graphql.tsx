import gql from 'graphql-tag';
import * as Urql from 'urql';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Query = {
  __typename?: 'Query';
  me?: Maybe<User>;
  allusers?: Maybe<UserResponse>;
  chatroom?: Maybe<ChatroomResponse>;
  allchatrooms?: Maybe<ChatroomResponse>;
  allmessages?: Maybe<ChatroomResponse>;
};


export type QueryChatroomArgs = {
  input: ChatroomRequest;
};

export type User = {
  __typename?: 'User';
  uuid: Scalars['String'];
  username: Scalars['String'];
  createdAt: Scalars['String'];
  updatedAt: Scalars['String'];
};

export type UserResponse = {
  __typename?: 'UserResponse';
  errors?: Maybe<Array<FieldError>>;
  user?: Maybe<User>;
  users?: Maybe<Array<User>>;
};

export type FieldError = {
  __typename?: 'FieldError';
  field: Scalars['String'];
  message: Scalars['String'];
};

export type ChatroomResponse = {
  __typename?: 'ChatroomResponse';
  errors?: Maybe<Array<ChatroomErrors>>;
  message?: Maybe<Message>;
  messages?: Maybe<Array<Message>>;
  messages2?: Maybe<Array<Message>>;
  chatroom?: Maybe<Chatroom>;
  chatrooms?: Maybe<Array<Chatroom>>;
};

export type ChatroomErrors = {
  __typename?: 'ChatroomErrors';
  field: Scalars['String'];
  message: Scalars['String'];
};

export type Message = {
  __typename?: 'Message';
  uuid: Scalars['String'];
  text: Scalars['String'];
  createdAt: Scalars['String'];
  updatedAt: Scalars['String'];
  username: Scalars['String'];
  chatroomUUID: Scalars['String'];
};

export type Chatroom = {
  __typename?: 'Chatroom';
  uuid: Scalars['String'];
  title: Scalars['String'];
  createdAt: Scalars['String'];
  updatedAt: Scalars['String'];
};

export type ChatroomRequest = {
  chatroomUUID: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  register: UserResponse;
  login: UserResponse;
  send?: Maybe<ChatroomResponse>;
  createChatroom?: Maybe<ChatroomResponse>;
};


export type MutationRegisterArgs = {
  input: UsernamePassInput;
};


export type MutationLoginArgs = {
  input: UsernamePassInput;
};


export type MutationSendArgs = {
  input: MessageInput;
};


export type MutationCreateChatroomArgs = {
  input: CreateChatroom;
};

export type UsernamePassInput = {
  username: Scalars['String'];
  password: Scalars['String'];
};

export type MessageInput = {
  chatroomUUID: Scalars['String'];
  text: Scalars['String'];
  username: Scalars['String'];
};

export type CreateChatroom = {
  title: Scalars['String'];
};

export type LoginMutationVariables = Exact<{
  username: Scalars['String'];
  password: Scalars['String'];
}>;


export type LoginMutation = (
  { __typename?: 'Mutation' }
  & { login: (
    { __typename?: 'UserResponse' }
    & { errors?: Maybe<Array<(
      { __typename?: 'FieldError' }
      & Pick<FieldError, 'field' | 'message'>
    )>>, user?: Maybe<(
      { __typename?: 'User' }
      & Pick<User, 'uuid' | 'username'>
    )> }
  ) }
);

export type RegisterMutationVariables = Exact<{
  username: Scalars['String'];
  password: Scalars['String'];
}>;


export type RegisterMutation = (
  { __typename?: 'Mutation' }
  & { register: (
    { __typename?: 'UserResponse' }
    & { errors?: Maybe<Array<(
      { __typename?: 'FieldError' }
      & Pick<FieldError, 'field' | 'message'>
    )>>, user?: Maybe<(
      { __typename?: 'User' }
      & Pick<User, 'uuid' | 'username'>
    )> }
  ) }
);


export const LoginDocument = gql`
    mutation Login($username: String!, $password: String!) {
  login(input: {username: $username, password: $password}) {
    errors {
      field
      message
    }
    user {
      uuid
      username
    }
  }
}
    `;

export function useLoginMutation() {
  return Urql.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument);
};
export const RegisterDocument = gql`
    mutation Register($username: String!, $password: String!) {
  register(input: {username: $username, password: $password}) {
    errors {
      field
      message
    }
    user {
      uuid
      username
    }
  }
}
    `;

export function useRegisterMutation() {
  return Urql.useMutation<RegisterMutation, RegisterMutationVariables>(RegisterDocument);
};