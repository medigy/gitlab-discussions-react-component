import React from 'react'

import GitLabDiscussions from 'gitlab-discussions-react-component';
import 'gitlab-discussions-react-component/dist/index.css';
const gitLabURL: string = 'https://devl.gl.next.infra.medigy.com';
const accessToken: string = 'd8453ffd16d008806539507e6c55e59e1fb16f27a2bea5b877888e5f5bd02b63';
const App = () => {
  return <GitLabDiscussions
    projectID={5908}
    gitLabURL={gitLabURL}
    issueID={2}
    accessToken={accessToken}
  />
}

export default App
