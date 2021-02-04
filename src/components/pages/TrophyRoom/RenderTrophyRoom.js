import React, { useState, useEffect, useRef } from 'react';
import Header from '../../common/Header';
import { connect } from 'react-redux';
import { Row, Col, Divider } from 'antd';

const RenderTrophyRoom = props => {
  //   const [isAchievementListVisible, setIsAchievementListVisible] = useState(
  //     false
  //   );
  //   const [achievementState, setAchievementState] = useState('');

  //   const showAchievementsList = () => {
  //     setIsAchievementListVisible(true);
  //     setAchievementState('child.achievements');
  //   };
  //   const handleAchievmentOk = () => {
  //     setIsAchievementListVisible(false);
  //   };

  //   const handleAchievementCancel = () => {
  //     setIsAchievementListVisible(false);
  //   };

  return (
    <>
      <Header displayMenu={true} title="Trophy Room" />
      <div className="trophy-container">
        <Divider orientation="center">
          {' '}
          <h2>Achievements</h2>
        </Divider>
        <Row gutter={[16, 24]}>
          <Col className="gutter-row" span={6}>
            <p>First Mission is Completed!</p>
          </Col>
          <Col className="gutter-row" span={6}>
            <p>Won first game</p>
          </Col>
          <Col className="gutter-row" span={6}>
            <p>Completed 10 Missions</p>
          </Col>
          <Col className="gutter-row" span={6}>
            <p>Voted 10 Times</p>
          </Col>
          <Col className="gutter-row" span={6}>
            <p>Won 10 Times</p>
          </Col>
          <Col className="gutter-row" span={6}></Col>
          <Col className="gutter-row" span={6}></Col>
          <Col className="gutter-row" span={6}></Col>
        </Row>
      </div>
    </>
  );
};

export default connect(
  state => ({
    child: state.child,
    tasks: state.tasks,
  }),
  {}
)(RenderTrophyRoom);
