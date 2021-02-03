import React, { useState, useEffect, useMemo } from 'react';
import { useOktaAuth } from '@okta/okta-react';
import { useHistory } from 'react-router-dom';

import RenderVotingPage from './RenderVotingPage';
import { connect } from 'react-redux';

import { getGameVotes } from '../../../api';

function VotingPageContainer({ LoadingComponent, ...props }) {
  const { push } = useHistory();
  const { authState, authService } = useOktaAuth();
  const [userInfo, setUserInfo] = useState(null);
  // eslint-disable-next-line
  const [memoAuthService] = useMemo(() => [authService], []);
  const [votes, setVotes] = useState();

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

  // render the faceoffs to be voted on
  useEffect(() => {
    getGameVotes(
      authState,
      props.faceoffs[0].SquadID,
      props.child.memberId
    ).then(res => {
      // determine if user has votes available
      let votesAvailable = false;
      if (res.length < 3) {
        votesAvailable = true;
      }
      // keep track of which faceoffIDs the user has voted on
      let faceoffsVotedOn = {};
      res.forEach(item => {
        faceoffsVotedOn[item.FaceoffID] = 1;
      });
      // find the smallest vote count, save that corresponding index as leastVotesIndex, but only if the user has not voted on that faceoffID already
      let leastVotes = 3;
      let leastVotesIndex = 0;
      for (let i = 0; i < 4; i++) {
        if (
          props.votes[i].TotalVotes < leastVotes &&
          !(props.votes[i].ID in faceoffsVotedOn)
        ) {
          leastVotes = props.votes[i].TotalVotes;
          leastVotesIndex = i;
        }
      }
      if (votesAvailable) {
        setVotes(props.votes[leastVotesIndex]);
      } else {
        push('/child/dashboard');
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {authState.isAuthenticated && !userInfo && (
        <LoadingComponent message="Loading..." />
      )}
      {authState.isAuthenticated && userInfo && votes && (
        <RenderVotingPage
          {...props}
          votes={votes}
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
  {}
)(VotingPageContainer);
