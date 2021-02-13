import React, { useState, useEffect, useRef } from 'react';
import Header from '../../common/Header';
import { connect } from 'react-redux';

const RenderAdventurePassport = props => {
  return (
    <>
      <Header displayMenu={true} title="Adventure Passport" />
      <div className="passport-container"></div>
    </>
  );
};

export default connect(
  state => ({
    child: state.child,
    tasks: state.tasks,
  }),
  {}
)(RenderAdventurePassport);
