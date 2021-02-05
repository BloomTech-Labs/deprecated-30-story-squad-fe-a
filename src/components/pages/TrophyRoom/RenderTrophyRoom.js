import React, { useState, useEffect, useRef } from 'react';
import Header from '../../common/Header';
import { connect } from 'react-redux';
import { Tabs, Row, Col, Divider, Table, Card, Button } from 'antd';
import {
  CompassTwoTone,
  SmileOutlined,
  TrophyTwoTone,
  StarTwoTone,
  CrownTwoTone,
  TeamOutlined,
  ReadOutlined,
  CalendarOutlined,
} from '@ant-design/icons';

const gridStyle = {
  width: '25%',
  textAlign: 'center',
};

const { TabPane } = Tabs;
const fixedColumns = [
  {
    title: 'User',
    dataIndex: 'name',
    fixed: true,
    width: 150,
  },
  {
    title: 'Total Points',
    dataIndex: 'description',
  },
];
const fixedData = [];
for (let i = 0; i < 6; i += 1) {
  fixedData.push({
    key: i,
    name: i % 2 ? 'Light' : 'Bamboo',
    description: 'Everything that has a beginning, has an end.',
  });
}

const RenderTrophyRoom = props => {
  return (
    <>
      <Header displayMenu={true} title="Trophy Room" />
      <Tabs
        defaultActiveKey="1"
        tabPosition="left"
        size="large"
        tabBarGutter={160}
      >
        <TabPane tab="Badges" key="1" style={{ margin: '0 auto' }}>
          <Divider orientation="center"></Divider>
          <Row justify="space-around">
            <Col span={4}>
              <Button type="ghost" icon={<CompassTwoTone />}>
                First Mission Completed
              </Button>{' '}
            </Col>
            <Col span={4}>
              <Button type="ghost" icon={<TrophyTwoTone />}>
                First Faceoff Win
              </Button>
            </Col>
            <Col span={4}>
              <Button type="ghost" icon={<StarTwoTone />}>
                Completed 10 Missions
              </Button>
            </Col>
            <Col span={4}>
              <Button type="ghost" icon={<CalendarOutlined />}>
                0 Losses This Month{' '}
              </Button>{' '}
            </Col>
          </Row>
          <Divider />
          <Divider />
          <Row justify="space-around">
            <Col span={4}>
              <Button type="ghost" icon={<CrownTwoTone />}>
                LeaderBoard Top Ten
              </Button>{' '}
            </Col>
            <Col span={4}>
              <Button type="ghost" icon={<TeamOutlined />}>
                First Squad Win
              </Button>
            </Col>
            <Col span={4}>
              <Button type="ghost" icon={<ReadOutlined />}>
                Read 50 Pages
              </Button>
            </Col>
            <Col span={4}>
              <Button type="ghost" icon={<SmileOutlined />}>
                Voted 20 Times
              </Button>
            </Col>
          </Row>
          <Divider />
        </TabPane>

        <TabPane tab="LeaderBoard" key="2">
          <Table
            columns={fixedColumns}
            dataSource={fixedData}
            pagination={false}
            scroll={{ x: 2000 }}
            bordered
            summary={() => (
              <Table.Summary.Row>
                <Table.Summary.Cell index={0}>UserName</Table.Summary.Cell>
                <Table.Summary.Cell index={1}>Total Points</Table.Summary.Cell>
              </Table.Summary.Row>
            )}
          />
        </TabPane>

        <TabPane tab="Stickers" key="3">
          <Divider />
          <Card>
            <Card.Grid style={gridStyle}>Content</Card.Grid>
            <Card.Grid hoverable={true} style={gridStyle}>
              Content
            </Card.Grid>
            <Card.Grid style={gridStyle}>Content</Card.Grid>
            <Card.Grid style={gridStyle}>Content</Card.Grid>
            <Card.Grid style={gridStyle}>Content</Card.Grid>
            <Card.Grid style={gridStyle}>Content</Card.Grid>
            <Card.Grid style={gridStyle}>Content</Card.Grid>
          </Card>
          ,
        </TabPane>
      </Tabs>
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
