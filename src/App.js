import React from 'react';

import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css';

import Modal from 'react-modal';

import Amplify, { Auth } from 'aws-amplify';
import awsconfig from './aws-exports';
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';

import { API, graphqlOperation } from "aws-amplify";
import * as mutations from './graphql/mutations';

Amplify.configure(awsconfig);

const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)',
    width                 : '50%',
    height                : '25%'
  }
};

Modal.setAppElement('#root')

function App() {
  const [modalIsOpen,setIsOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState();
  const [selectedDay, setSelectedDay] = React.useState();

  function openModal(event) {
    setIsOpen(true);
    setSelectedDay(event);
  }

  function afterOpenModal() {
    console.log("open!!!!")
  }

  function closeModal(){
    setIsOpen(false);
  }

  function handleSubmit(){
    const memoDetails = {
      memo: inputValue,
      date: selectedDay
    };
    
    const createMemo = () => (
      API.graphql(graphqlOperation(mutations.createMemo, {input: memoDetails}))
    )
    
    createMemo();
  }

  return (
    <div id="root">
      <AmplifySignOut />
      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <form onSubmit={handleSubmit}>
          <label>
            Memo:
            <input type="text" value={inputValue} onChange={ (e) => (setInputValue(e.target.value)) }/>
          </label>
        <input type="submit" value="Submit" />
      </form>
      </Modal>
      <Calendar
        onClickDay={openModal}
      />
    </div>
  );
}

export default withAuthenticator(App);
