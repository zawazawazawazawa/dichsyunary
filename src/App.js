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
    let memos;
    (async () => {
      const formatedSelectedDay = new Intl.DateTimeFormat('ja-JP').format(selectedDay)
      memos = await API.graphql(graphqlOperation(listMemos, { filter: { date: { eq: formatedSelectedDay } } })
                ).then(({ data: { listMemos } }) => {
                  setMemos(listMemos.items);
                });
    })(); 
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

  const MemosList = () => (
    <table>
      <thead>
        <tr>
          <th>createdAt</th>
          <th>memo</th>
        </tr>
      </thead>
      <tbody>
        {memos.map(function(item, index) {
          return (
            <tr key={index}>
              <td>{item.createdAt}</td>
              <td>{item.memo}</td>
            </tr>
          )
        })}
      </tbody>
    </table>
  );

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
        { memos != undefined &&
          <>
            <label>Memos: </label>
            <MemosList />
          </>
        }
      </form>
      </Modal>
      <Calendar
        onClickDay={openModal}
      />
    </div>
  );
}

export default withAuthenticator(App);
