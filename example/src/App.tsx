import React from 'react'

import GitLabDiscussions from 'gitlab-discussions-react-component';
import 'gitlab-discussions-react-component/dist/index.css';
const gitLabURL: string = 'XXXXXXXXXXXXXX';
const accessToken: string = 'XXXXXXXXXXXXX';
const App = () => {
  return <GitLabDiscussions
    projectID={5908}
    gitLabURL={gitLabURL}
    issueID={2}
    accessToken={accessToken}
  />
}

export default App
