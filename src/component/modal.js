import React from 'react';
import Modal from 'react-modal';
import { listMemos, listAlcohols } from '../graphql/queries';
import { API, graphqlOperation } from "aws-amplify";
import * as mutations from '../graphql/mutations';
import beer_icon from '../images/drink_beer.png'

const MemoModal = (props) => {
  // TODO: 
  // 毎度データをCreateしているのでUpdateへ変更

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
    (async () => {
      const formatedSelectedDay = new Intl.DateTimeFormat('ja-JP').format(props.selectedDay)
      console.log("date using filter: ", formatedSelectedDay)
      await API.graphql(graphqlOperation(listAlcohols, { filter: { date: { eq: formatedSelectedDay } } })
              ).then(({ data: { listAlcohols } }) => {
                console.log("count: ", listAlcohols.items.sort())
                setBeerCount(listAlcohols.items[listAlcohols.items.length - 1]?.beer || 0);
              });
    })(); 
  }

  const handleSubmit = () => {
    (() => {
      API.graphql(graphqlOperation(mutations.createMemo, {input: {
        memo: inputValue,
        date: new Intl.DateTimeFormat('ja-JP').format(props.selectedDay)
      }}));

      API.graphql(graphqlOperation(mutations.createAlcohol, {input: {
        beer: beerCount,
        date: new Intl.DateTimeFormat('ja-JP').format(props.selectedDay)
      }}));
    })();
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
