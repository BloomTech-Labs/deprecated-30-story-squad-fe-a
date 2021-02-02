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

  // We planned on changing this code below, but didn't have time. We wanted to loop through each faceoffID (within this squad)
  // and find the smallest TotalVote count, then let the user vote on that one. Also make sure that this user (memberID)
  // has not voted on this particular faceoff already.
  useEffect(() => {
    getGameVotes(
      authState,
      props.faceoffs[0].SquadID,
      props.child.memberId
    ).then(res => {
      if (res.length === 0) {
        // if user hasn't voted at all
        setVotes(props.votes[3]); // get 4th faceoff to vote on
      } else if (res.length === 1) {
        // if user has voted once,
        setVotes(props.votes[2]); // get the 3rd faceoff to vote on
      } else if (res.length === 2) {
        // if user has voted 2 times,
        setVotes(props.votes[1]); // get the 2nd faceoff to vote on
      } else {
        // all 3 votes are used, so push to dashboard, which unfortunately skips 1st faceoff
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
