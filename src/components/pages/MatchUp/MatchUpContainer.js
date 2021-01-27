import React, { useState, useEffect, useMemo } from 'react';
import { useOktaAuth } from '@okta/okta-react';

import RenderMatchUp from './RenderMatchUp';
import { connect } from 'react-redux';

import { child, faceoffs, votes } from '../../../state/actions';
import {
  getChildSquad,
  getFaceoffsForMatchup,
  getFaceoffsForVoting,
  getTotalNumOfSquads,
} from '../../../api/index';

function MatchUpContainer({ LoadingComponent, ...props }) {
  const { authState, authService } = useOktaAuth();
  const [userInfo, setUserInfo] = useState(null);
  // eslint-disable-next-line
  const [memoAuthService] = useMemo(() => [authService], []);
  // const [faceoffs, setFaceoffs] = useState(null);

  useEffect(() => {
    let isSubscribed = true;

    memoAuthService
      .getUser()
      .then(info => {
        // if user is authenticated we can use the authService to snag some user info.
        // isSubscribed is a boolean toggle that we're using to clean up our useEffect.
        if (isSubscribed) {
          setUserInfo(info);
        }
      })
      .catch(err => {
        isSubscribed = false;
        return setUserInfo(null);
      });
    return () => (isSubscribed = false);
  }, [memoAuthService]);

  useEffect(() => {
    // get users' squad, from that determine which squad the user will be voting on
    let numOfSquads = 0;
    getTotalNumOfSquads(authState, props.child.cohortId).then(totalSquads => {
      numOfSquads = totalSquads.length;
    });
    getChildSquad(authState, props.child.id).then(squad => {
      getFaceoffsForMatchup(authState, squad.ID, props.child.id).then(
        allFaceoffs => {
          props.setMemberId(squad);
          props.setSquadFaceoffs(allFaceoffs);
        }
      );
      // All squads will vote on the next squad, except the last squad votes on the first squad
      getFaceoffsForVoting(authState, (squad.ID % numOfSquads) + 1).then(
        faceoffs => {
          props.setVotes(faceoffs);
        }
      );
    });

    // eslint-disable-next-line
  }, [authState]);

  return (
    <>
      {authState.isAuthenticated && !userInfo && (
        <LoadingComponent message="Loading..." />
      )}
      {authState.isAuthenticated && userInfo && props.faceoffs && (
        <RenderMatchUp
          {...props}
          userInfo={userInfo}
          authService={authService}
        />
      )}
    </>
  );
}

export default connect(
  state => ({
    child: state.child,
    faceoffs: state.faceoffs,
    votes: state.votes,
  }),
  {
    setSquadFaceoffs: faceoffs.setSquadFaceoffs,
    setMemberId: child.setMemberId,
    setVotes: votes.setVotes,
  }
)(MatchUpContainer);
