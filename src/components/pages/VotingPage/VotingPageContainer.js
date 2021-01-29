import React, { useState, useEffect, useMemo } from 'react';
import { useOktaAuth } from '@okta/okta-react';
import { useHistory } from 'react-router-dom';

import RenderVotingPage from './RenderVotingPage';
import { connect } from 'react-redux';

import { getGameVotes } from '../../../api';

// assuming: this component is for user to vote on 3 faceoffs

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

  useEffect(() => {
    getGameVotes(
      authState,
      props.faceoffs[0].SquadID,
      props.child.memberId
    ).then(res => {
      console.log(
        'THIS SHOULD BE ARRAY OF 4 FACEOFFS TO BE VOTED ON***',
        props.votes
      );
      console.log('THIS SHOULD BE Id of first index***', props.votes[1]['ID']);
      console.log('THIS IS RES FROM GETGAMEVOTES', res);
      if (res.length === 0) {
        // if (props.votes.TotalVotes)
        // this is what 0 index of props.votes = [{(faceoffID) ID: 15, , Points: 180, SquadID: 4, Submission1: {ID/Name/Img/Avatar/Pages}, Submission2: {ID/Name/Img/Avatar/Pages}, SubmissionID1: 13,  SubmissionID2: 15, Type: "WRITING", Winner: null}]

        // if user hasn't voted at all
        setVotes(props.votes[3]); // get 4th faceoff to vote on
      } else if (res.length === 1) {
        // if user has voted once,
        setVotes(props.votes[2]); // get the 3rd faceoff to vote on
      } else if (res.length === 2) {
        // if user has voted 2 times,
        setVotes(props.votes[1]); // get the 2nd faceoff to vote on
      } else {
        // all 3 votes are used, so push to dashboard, which skips 1st faceoff
        push('/child/dashboard');
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * It appears that GenerateResults link determines if there is a winner in each faceoff...so currently we can't test ifWinner case (while in the voting phase) in order to save that 3rd non-decisive vote
   * Squads | Faceoffs fkSquads | Votes fkFaceoffs
   *
   * Maybe we need to add a field "TotalVotes" to Faceoffs table
   * get: all faceoffs for this squadID (props.votes has this data already)
   * Need to find total votes cast per faceoffID!!! pass in SquadID and MemberID to a DB request (**We need to join a table to get FaceoffIDs from the SquadID passed in**) to Votes table, query: select "FaceoffID", "Votes", where "Votes" < 3 && where memberID is not in "MemberID". Then on the Front End iterate through the response checking for the smallest vote length then return the faceoff that corresponds. Then iterate through props.votes to find which object has faceoffID === "ID" and return that faceoffIndex. Render props.votes[faceoffIndex]
   *
   * THIS IS RES FROM GETGAMEVOTES
   *   (3) [{…}, {…}, {…}]
   *       0: {FaceoffID: 14, Vote: 1}
   *       1: {FaceoffID: 15, Vote: 2}
   *       2: {FaceoffID: 16, Vote: 2}
   *
   *   (getGameVotes is already returning the votes cast to the UI for the current user...maybe this is helpful)
   *   if true, then render that faceoff to be voted on
   *   else, there is an error
   */

  // useEffect(() => {
  //   // this fn renders each faceoff (within 1 squad) (via a special iteration pattern) to ensure user does not vote twice on same faceoff. A user will vote 3 times total
  //   getGameVotes(
  //     authState,
  //     props.faceoffs[0].SquadID,
  //     props.child.memberId
  //   ).then(res => {
  //     console.log("setSquadVotedOn", squadVotedOn);
  //     if (squadVotedOn === 0) {
  //       if (res.length === 0) {
  //         setVotes(props.votes[0]);
  //       } else if (res.length === 1) {
  //         setVotes(props.votes[1]);
  //       } else if (res.length === 2) {
  //         setVotes(props.votes[2]);
  //       } else {
  //         setSquadVotedOn(1);
  //         push('/child/dashboard');
  //       }
  //     } else if (squadVotedOn === 1) {
  //       if (res.length === 0) {
  //         setVotes(props.votes[1]);
  //       } else if (res.length === 1) {
  //         setVotes(props.votes[2]);
  //       } else if (res.length === 2) {
  //         setVotes(props.votes[3]);
  //       } else {
  //         setSquadVotedOn(2);
  //         push('/child/dashboard');
  //       }
  //     } else if (squadVotedOn === 2) {
  //       if (res.length === 0) {
  //         setVotes(props.votes[2]);
  //       } else if (res.length === 1) {
  //         setVotes(props.votes[3]);
  //       } else if (res.length === 2) {
  //         setVotes(props.votes[0]);
  //       } else {
  //         setSquadVotedOn(3);
  //         push('/child/dashboard');
  //       }
  //     } else {
  //       if (res.length === 0) {
  //         setVotes(props.votes[3]);
  //       } else if (res.length === 1) {
  //         setVotes(props.votes[0]);
  //       } else if (res.length === 2) {
  //         setVotes(props.votes[1]);
  //       } else {
  //         setSquadVotedOn(4);
  //         push('/child/dashboard');
  //       }
  //     };
  //   });
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);
  // create table SquadVoterAssignment

  // This logic assumes a circular voting assignment for each squad:
  // (squad A votes on squad B, squad B votes on Squad C, squad C votes on Squad A)
  // Need to keep track of this circular voting assignment, maybe in a new table, (current seed data is not large enough to test this...only 2 squads)
  // Need votingOrder and willVoteOnSquadID fields
  // votingOrder should be populated when squads are created:
  // memberID: 11, squadID: 3, willVoteOnSquadID: 4, votingOrder: [0,1,2]
  // memberID: 12, squadID: 3, willVoteOnSquadID: 4, votingOrder: [1,2,3]
  // memberID: 13, squadID: 3, willVoteOnSquadID: 4, votingOrder: [2,3,0]
  // memberID: 14, squadID: 3, willVoteOnSquadID: 4, votingOrder: [3,0,1]

  // if (res.length === 0) {
  //   setVotes(props.votes[votingOrder[0]]);
  // } else if (res.length === 1) {
  //    setVotes(props.votes[votingOrder[1]]);
  // } else if (res.length === 2) {
  //    setVotes(props.votes[votingOrder[2]]);
  // } else {
  //    push('/child/dashboard');
  // }

  return (
    <>
      {authState.isAuthenticated && !userInfo && (
        <LoadingComponent message="Loading..." />
      )}
      {authState.isAuthenticated && userInfo && votes && (
        <RenderVotingPage
          {...props}
          // 'votes' might include the Submission1/Submission2 (RenderVotingPage.js) for images to be voted on which correspond to SubmissionID1/SubmissionID2 (VotingForm.js)
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
