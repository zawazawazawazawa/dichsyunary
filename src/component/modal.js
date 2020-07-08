import React from 'react';
import Modal from 'react-modal';
import { listMemos } from '../graphql/queries';
import { API, graphqlOperation } from "aws-amplify";
import * as mutations from '../graphql/mutations';
import beer_icon from '../images/drink_beer.png'

const MemoModal = (props) => {
  const [memos, setMemos] = React.useState([]);
  const [inputValue, setInputValue] = React.useState('');
  const [beerCount, setBeerCount] = React.useState(0);
  Modal.setAppElement('#root')

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

  const closeModal = () => {
    props.setIsOpen(false);
  }

  const afterOpenModal = () => {
    (async () => {
      const formatedSelectedDay = new Intl.DateTimeFormat('ja-JP').format(props.selectedDay)
      await API.graphql(graphqlOperation(listMemos, { filter: { date: { eq: formatedSelectedDay } } })
              ).then(({ data: { listMemos } }) => {
                setMemos(listMemos.items);
              });
    })(); 
  }

  const handleSubmit = () => {
    const memoDetails = {
      memo: inputValue,
      date: new Intl.DateTimeFormat('ja-JP').format(props.selectedDay)
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

  const CountUp = () => {
    setBeerCount(beerCount + 1);
  }

  return (
    <Modal
      isOpen={props.isOpen}
      onAfterOpen={afterOpenModal}
      onRequestClose={closeModal}
      style={customStyles}
      contentLabel="Example Modal"
    >
      <form onSubmit={handleSubmit}>
        <div style={{width: "10%"}} onClick={CountUp}><img src={beer_icon} alt='ビールのアイコン' style={{width: "100%"}}/></div>
        <div>Beer Count: {beerCount}</div>
        <label>
          Memo:
          <input type="text" value={inputValue} onChange={ (e) => (setInputValue(e.target.value)) }/>
        </label>
        <input type="submit" value="Submit" />
      </form>
      { memos !== undefined &&
        <>
          <label>Memos: </label>
          <MemosList />
        </>
      }
    </Modal>
  )
}

export default MemoModal;
