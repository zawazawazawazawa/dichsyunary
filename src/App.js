import React from 'react';

import MemoModal from "./component/modal";

import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css';

import Amplify from 'aws-amplify';
import awsconfig from './aws-exports';
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';


Amplify.configure(awsconfig);

const App = () => {
  const [isOpen,setIsOpen] = React.useState(false);
  const [selectedDay, setSelectedDay] = React.useState();


  const openModal = (event) => {
    setIsOpen(true);
    setSelectedDay(event);
  }

  return (
    <div id="root">
      <AmplifySignOut />
      <MemoModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        selectedDay={selectedDay}
        setSelectedDay={setSelectedDay}
      />
      <Calendar
        onClickDay={openModal}
      />
    </div>
  );
}

export default withAuthenticator(App);
