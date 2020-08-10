import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { listMemos, listAlcohols } from '../graphql/queries';
import { API, graphqlOperation } from "aws-amplify";
import * as mutations from '../graphql/mutations';
import beer_icon from '../images/drink_beer.png'
import highball_icon from '../images/highball.png'
import sour_icon from '../images/sour.png'

const MemoModal = (props) => {
  const [memo, setMemo] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [beerCount, setBeerCount] = useState(0);
  const [highballCount, setHighballCount] = useState(0);
  const [sourCount, setSourCount] = useState(0);
  const [alcoholeRecordID, setAlcoholeRecordID] = useState('');
  const [memoID, setMemoID] = useState('')
  Modal.setAppElement('#root')

  const alcoholByVolume = {
    beer: 0.07,
    highball: 0.07,
    sour: 0.05
  }

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
                setHighballCount(listAlcohols.items[listAlcohols.items.length - 1]?.highball || 0);
                setSourCount(listAlcohols.items[listAlcohols.items.length - 1]?.sour || 0);
                setAlcoholeRecordID(listAlcohols.items[listAlcohols.items.length - 1]?.id || "")
              });
    })();
  }

  const handleSubmit = () => {
    (() => {
      if (memoID == "") {
        // memoがなければ新規作成
        API.graphql(graphqlOperation(mutations.createMemo, {input: {
          memo: inputValue,
          date: new Intl.DateTimeFormat('ja-JP').format(props.selectedDay)
        }}));
      } else if (memo !== "") {
        // memoのレコードが存在し、フォームに新たに入力されていればその値で更新
        API.graphql(graphqlOperation(mutations.updateMemo, {input: {
          id: memoID,
          memo: inputValue,
          date: new Intl.DateTimeFormat('ja-JP').format(props.selectedDay)
        }}));
      } else {
        // memoのレコードは存在し、今回フォームに何も記入されていなければ更新しない
        return
      }


      if (alcoholeRecordID === "") {
        API.graphql(graphqlOperation(mutations.createAlcohol, {input: {
          beer: beerCount,
          highball: highballCount,
          sour: sourCount,
          date: new Intl.DateTimeFormat('ja-JP').format(props.selectedDay)
        }}));
      } else {
        API.graphql(graphqlOperation(mutations.updateAlcohol, {input: {
          id: alcoholeRecordID,
          beer: beerCount,
          highball: highballCount,
          sour: sourCount,
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

  const CountUpBeer = () => {
    setBeerCount(beerCount + 1);
  }

  const CountUpHighball = () => {
    setHighballCount(highballCount + 1);
  }

  const CountUpSour = () => {
    setSourCount(sourCount + 1);
  }

  const CalcurateAlcoholByVolume = () => {
    // ドリンクの種類の数だけここの計算が走る
    return Math.round((
      beerCount * alcoholByVolume['beer'] * 350
      + highballCount * alcoholByVolume['highball'] * 350
      + sourCount * alcoholByVolume['sour'] * 350
    ) * 0.8)
  }

  useEffect(() => {
    console.log('waiwai', CalcurateAlcoholByVolume());
  })

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
          <div className="beer" onClick={CountUpBeer}>
            <label>Beer: {beerCount}</label>
            <div style={{width: "30%"}} ><img src={beer_icon} alt='ビールのアイコン' style={{width: "100%"}}/></div>
          </div>
        </div>
        <div className="drink">
          <div className="highball" onClick={CountUpHighball}>
            <label>Highball: {highballCount}</label>
            <div style={{width: "30%"}} ><img src={highball_icon} alt='ハイボールのアイコン' style={{width: "100%"}}/></div>
          </div>
        </div>
        <div className="drink">
          <div className="sour" onClick={CountUpSour}>
            <label>Sour: {sourCount}</label>
            <div style={{width: "30%"}} ><img src={sour_icon} alt='サワーのアイコン' style={{width: "100%"}}/></div>
          </div>
        </div>
      </div>
      <div className='tatalABV'>
        <label>Total Alcohol By Volume</label>
        <div>{CalcurateAlcoholByVolume()} ml</div>
      </div>
      <form onSubmit={handleSubmit}>
        <label>
          Memo:
          <input type="text" value={inputValue} onChange={ (e) => (setInputValue(e.target.value)) }/>
        </label>
        <input type="submit" value="Submit" />
      </form>
      { memo !== null &&
        <MemosList />
      }
    </Modal>
  )
}

export default MemoModal;
