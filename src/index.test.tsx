import GitLabDiscussions from ".";
import axios from 'axios';
const gitLabURL: string = `<GITLAB BASE URL>`;
const accessToken: string = `<YOUR PERSONAL GITLAB ACCESS TOKEN>`;
const projectID: number = 1; // GITLAB PROJECT ID 
const issueID: number = 2; // ISSUE ID OF THE PROJECT
describe('GitLabDiscussions', () => {
  it('is truthy', () => {
    expect(GitLabDiscussions).toBeTruthy()
  })
})

describe('Test to get user information', () => {
  test('The user id should be a number', async () => {
    const userInfo = await axios.get(`${gitLabURL}/api/v4/user?access_token=${accessToken}`);
    expect(userInfo).toBeDefined();
    expect(userInfo.status).toBe(200);
    expect(userInfo.data).toBeDefined();
    expect(typeof userInfo.data.id).toBe('number');
  })
})

describe('Test to check the project exist or not', () => {
  test('The project name should be a string', async () => {
    const projectInfo = await axios.get(`${gitLabURL}/api/v4/projects/${projectID}?access_token=${accessToken}`);
    expect(projectInfo).toBeDefined();
    expect(projectInfo.status).toBe(200);
    expect(projectInfo.data).toBeDefined();
    expect(projectInfo.data.path).toBeDefined();
    expect(typeof projectInfo.data.name).toBe('string');
  })
})

describe('Test to check the issue exist or not', () => {
  test('The issue iid should be a number', async () => {
    const issueInfo = await axios.get(`${gitLabURL}/api/v4/projects/${projectID}/issues/${issueID}?access_token=${accessToken}`);
    expect(issueInfo).toBeDefined();
    expect(issueInfo.status).toBe(200);
    expect(issueInfo.data).toBeDefined();
    expect(issueInfo.data.project_id).toBeDefined();
    expect(typeof issueInfo.data.iid).toBe('number');
  })
})

describe('Test to get the discussions of an issue', () => {
  test('The status should be 200', async () => {
    const discussions = await axios.get(`${gitLabURL}/api/v4/projects/${projectID}/issues/${issueID}/discussions?access_token=${accessToken}`);
    expect(discussions).toBeDefined();
    expect(discussions.status).toBe(200);
    expect(typeof discussions.data).toBe('object');
  })
})