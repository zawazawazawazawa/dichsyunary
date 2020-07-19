import React from 'react';
import Modal from 'react-modal';
import { listMemos, listAlcohols } from '../graphql/queries';
import { API, graphqlOperation } from "aws-amplify";
import * as mutations from '../graphql/mutations';
import beer_icon from '../images/drink_beer.png'

const MemoModal = (props) => {
  const [memo, setMemo] = React.useState();
  const [inputValue, setInputValue] = React.useState('');
  const [beerCount, setBeerCount] = React.useState(0);
  const [alcoholeRecordID, setAlcoholeRecordID] = React.useState('');
  const [memoID, setMemoID] = React.useState('')
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
                setMemo(listMemos.items[listMemos.items.length - 1] || null);
                setMemoID(listMemos.items[listMemos.items.length - 1]?.id || "")
              });
    })(); 
    (async () => {
      const formatedSelectedDay = new Intl.DateTimeFormat('ja-JP').format(props.selectedDay)
      await API.graphql(graphqlOperation(listAlcohols, { filter: { date: { eq: formatedSelectedDay } } })
              ).then(({ data: { listAlcohols } }) => {
                setBeerCount(listAlcohols.items[listAlcohols.items.length - 1]?.beer || 0);
                setAlcoholeRecordID(listAlcohols.items[listAlcohols.items.length - 1]?.id || "")
              });
    })();
  }

  const handleSubmit = () => {
    (() => {
      if (memoID == "") {
        API.graphql(graphqlOperation(mutations.createMemo, {input: {
          memo: inputValue,
          date: new Intl.DateTimeFormat('ja-JP').format(props.selectedDay)
        }}));
      } else {
        API.graphql(graphqlOperation(mutations.updateMemo, {input: {
          id: memoID,
          memo: inputValue,
          date: new Intl.DateTimeFormat('ja-JP').format(props.selectedDay)
        }}));
      }


      if (alcoholeRecordID === "") {
        API.graphql(graphqlOperation(mutations.createAlcohol, {input: {
          beer: beerCount,
          date: new Intl.DateTimeFormat('ja-JP').format(props.selectedDay)
        }}));
      } else {
        API.graphql(graphqlOperation(mutations.updateAlcohol, {input: {
          id: alcoholeRecordID,
          beer: beerCount,
          date: new Intl.DateTimeFormat('ja-JP').format(props.selectedDay)
        }}));
      }

    })();
  }

  const MemosList = () => (
    <table>
      <thead>
        <tr>
          <th>updatedAt</th>
          <th>memo</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{memo.updatedAt}</td>
          <td>{memo.memo}</td>
        </tr>
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
      <div className="drinks" style={{display: "flex"}}>
        <div className="drink">
          <div className="beer" onClick={CountUp}>
            <label>Beer</label>
            <label>Count: {beerCount}</label>
            <div style={{width: "10%"}} ><img src={beer_icon} alt='ビールのアイコン' style={{width: "100%"}}/></div>
          </div>
        </div>
        <div className="drink">
          <label>Highball</label>
        </div>
        <div className="drink">
          <label>Sour</label>
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <label>
          Memo:
          <input type="text" value={inputValue} onChange={ (e) => (setInputValue(e.target.value)) }/>
        </label>
        <input type="submit" value="Submit" />
      </form>
      { memo !== undefined &&
        <>
          <label>Memo: </label>
          <MemosList />
        </>
      }
    </Modal>
  )
}

export default MemoModal;
