import React, { useState, useEffect, useRef } from 'react';
import Header from '../../common/Header';
import { connect } from 'react-redux';

const RenderChangeAvatar = props => {
  return (
    <>
      <Header displayMenu={true} title="Change your avatar" />
      <div className="avatar-container"></div>
    </>
  );
};

export default connect(
  state => ({
    child: state.child,
    tasks: state.tasks,
  }),
  {}
)(RenderChangeAvatar);
