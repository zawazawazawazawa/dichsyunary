import React from 'react';

import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css';

import Modal from 'react-modal';

import Amplify, { Auth } from 'aws-amplify';
import awsconfig from './aws-exports';
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';

import { API, graphqlOperation } from "aws-amplify";
import * as mutations from './graphql/mutations';

import { listMemos } from './graphql/queries';

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
  const [memos, setMemos] = React.useState([]);

  function openModal(event) {
    setIsOpen(true);
    setSelectedDay(event);
  }

  function afterOpenModal() {
    const memosList = getMemos();
    console.log(memosList)
    setMemos(memosList);
  }

  const getMemos = async () => {
    const formatedSelectedDay = new Intl.DateTimeFormat('ja-JP').format(selectedDay)
    const memos = await API.graphql(graphqlOperation(listMemos, { filter: { date: { eq: formatedSelectedDay } } }));
    return memos;
  }

  function closeModal(){
    setIsOpen(false);
  }

  function handleSubmit(){
    const memoDetails = {
      memo: inputValue,
      date: new Intl.DateTimeFormat('ja-JP').format(selectedDay)
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
