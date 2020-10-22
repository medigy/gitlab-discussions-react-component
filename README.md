# GitLab Discussion Component
React component for discussions of an issue in a GitLab project.

## Installation

---
Create .npmrc file in the project root and add the following GitHub package registry code in the file.

```bash
    @medigy:registry=https://npm.pkg.github.com
```

Then, Install from the command line:

```bash
    npm install @medigy/gitlab-discussions-react-component
```
OR

Install via package.json:
```bash
    "@medigy/gitlab-discussions-react-component": "^1.0.0"
```

## To get the GitLab discussions:

Import the following library and styles in your page
```javascript
    import GitLabDiscussions from '@medigy/gitlab-discussions-react-component';
    import '@medigy/gitlab-discussions-react-component/dist/index.css';
```
Then include the component in your render method like the following

```javascript
    <GitLabDiscussions
        projectID={<projectID>}
        gitLabURL={<GitLabURL>}
        issueID={<userID>}
        accessToken={<GitLabAccessToken>}
    />
```


Props Configuration

| Key| Value| Type |
|---|---|---|
|projectID | GitLab project id | Integer
|gitLabURL | GitLab URL from which you want to fetch the discussions | String
|issueID | Issue id of the project | Integer
|accessToken| GitLab personal access token | String
