import React from 'react';
import Box from '@material-ui/core/Box';
import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Moment from 'react-moment';
import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline';
import EditIcon from '@material-ui/icons/Edit';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import styles from './styles.module.css';
// import './styles.module.css';

interface IDiscussionsProps {
  readonly gitLabURL: string;
  readonly projectID: number;
  readonly issueID: number;
  readonly accessToken: string;
}
interface IDiscussionsState {
  loader: boolean;
  allComments: IComments[];
  editedContent: string;
  replyComment: string;
  disableEdit: { [key: string]: boolean };
  disableReply: { [key: string]: boolean };
  richText: { [key: string]: boolean };
  editComment: { [key: string]: boolean };
  moreOptions: { [key: string]: boolean };
  commentText: string;
  disableCommentButton: boolean;
  userName: string;
  userAvatar: string;
  userId?: number;
  anchorEl: Element | null;
  openAlert: boolean;
  discussionId: string;
  noteId?: string;
}
interface IAuthor {
  readonly avatar_url: string;
  readonly id: number;
  readonly name: string;
  readonly state: string;
  readonly username: string;
  readonly web_url: string;
}
interface INotes {
  readonly author: IAuthor;
  readonly body: string;
  readonly confidential: boolean;
  readonly created_at: string;
  readonly id: string;
  readonly noteable_id: number;
  readonly noteable_iid: number;
  readonly noteable_type: string;
  readonly resolvable: boolean;
  readonly system: boolean;
  readonly type: string;
  readonly updated_at: string;
}
interface IComments {
  readonly id: string;
  readonly individual_note: boolean;
  readonly notes: Array<INotes>;
}
interface IEditor {
  readonly getData: Function;
  setData: Function
}
interface ICommentBody {
  id: number;
  issue_iid: number;
  body: string;
  discussion_id?: string;
  note_id?: string;
};
interface IRequestParams {
  method: string;
  readonly accessToken: string;
};
interface IUser {
  readonly id: number;
  readonly avatar_url: string;
  readonly name: string;
}
class GitLabDiscussions extends React.Component<IDiscussionsProps, IDiscussionsState>  {
  private editorInstance!: IEditor;

  constructor(props: IDiscussionsProps) {
    super(props);
    this.state = {
      loader: true,
      allComments: [],
      editComment: {},
      editedContent: '',
      disableEdit: {},
      richText: {},
      disableReply: {},
      moreOptions: {},
      commentText: '',
      replyComment: '',
      disableCommentButton: true,
      userName: '',
      userAvatar: '',
      userId: undefined,
      anchorEl: null,
      openAlert: false,
      discussionId: '',
      noteId: undefined
    };
  }

  public componentDidMount = () => {
    this.getUserInfo(this.props.accessToken);
    this.getComments();
  }

  public render(): React.ReactElement<IDiscussionsProps> {
    return (
      <Box component='div' id='gitlab-discussions' className={styles.gitlabDiscussions}>
        {this.state.allComments.map((comments: IComments) => {
          return !comments.individual_note ?
            <Box component='div' className={styles.gitlabCommentsOuter} key={`comment-${comments.id}`}>
              {comments.notes.map((comment: INotes, j: number) => {
                return comment.system === false ?
                  <Box component='div' key={`git-lab-comment-note-${j}`} className={styles.gitLabComments}>
                    <Grid container>

                      <Box component='span' className={styles.gitLabCommentAvatar}>
                        <Avatar alt={comment.author.name} src={comment.author.avatar_url} />
                      </Box>
                      <Box component='div' className={styles.gitLabCommentBody}>
                        <Box component='div' className={styles.gitLabCommentAuthorName}>
                          <Box component='span' fontWeight='fontWeightMedium'>{comment.author.name}
                           - <Moment fromNow>{comment.created_at}</Moment>
                          </Box>

                          <Box className={styles.gitLabCommentIcons} component='span'>
                            {j === 0 ?
                              <Box component='span' className={styles.gitLabReplyCommentIcon}>
                                <ChatBubbleOutlineIcon onClick={() => this.changeToRichText(comments.id, true)} />
                              </Box> : null}
                            <Box component='span' className={styles.gitLabEditCommentIcon}>
                              <EditIcon onClick={() => this.showEditComment(comment.id)} />
                            </Box>
                            <Box component='span' className={styles.gitLabMoreCommentIcon}>
                              <MoreVertIcon aria-controls="simple-menu" aria-haspopup="true" onClick={(e) => this.moreButtonClick(e, comment.id)} />
                            </Box>
                            <Menu
                              id="simple-menu"
                              anchorEl={this.state.anchorEl}
                              keepMounted
                              open={this.state.moreOptions[comment.id] ? this.state.moreOptions[comment.id] : false}
                              onClose={() => this.closeMoreOptions(comment.id)}
                            >
                              <MenuItem onClick={() => this.confirmDelete(comments.id, comment.id)}>Delete</MenuItem>
                            </Menu>
                          </Box>
                        </Box>
                        {!this.state.editComment[comment.id] ?
                          <Box component='span' className={styles.gitLabCommentBody} dangerouslySetInnerHTML={{ __html: comment.body }} /> :
                          <Box component='div' mt={4}>
                            <CKEditor
                              config={{
                                toolbar: ['heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote']
                              }}
                              editor={ClassicEditor}
                              onInit={() => {
                                const a: { [key: string]: boolean } = {};
                                a[comment.id] = true;
                                this.setState({
                                  editedContent: comment.body,
                                  disableEdit: a
                                });
                              }}
                              onChange={(_event: React.ChangeEvent<HTMLInputElement>, editor: IEditor) => {
                                const textComment: string = editor.getData();
                                this.setState({ editedContent: textComment });
                                const a: { [key: string]: boolean } = {};
                                if (!textComment) {
                                  a[comment.id] = true;
                                  this.setState({ disableEdit: a });
                                } else {
                                  a[comment.id] = false;
                                  this.setState({ disableEdit: a });
                                }
                              }}
                              data={comment.body}
                            />
                            <Box component='div' className={styles.pullRight} mt={1} mr={1}>
                              <Button variant='contained' color='primary' onClick={() => this.cancelEdit(comment.id)}>Cancel</Button>{'  '}
                              <Button className='dqa-edit-comment' disabled={this.state.disableEdit[comment.id]} type='submit' variant='contained' color='primary'
                                onClick={() => this.editComment(comments.id, comment.id)}>Edit Comment</Button>
                            </Box>
                          </Box>}
                        <div className='clearfix'></div>
                      </Box>
                    </Grid>
                    {((comments.notes).length) - 1 === j ?
                      <Grid container className={styles.gitLabReplyBox}>
                        <Grid className={styles.replyImage}>
                          <Avatar alt={this.state.userName} src={this.state.userAvatar} />
                        </Grid>
                        <Grid xs={10} className={styles.replyCommentBox}>
                          <form className={styles.gitLabReplyCommentForm}>
                            {!this.state.richText[comments.id] ?
                              <TextField size='small' className={styles.replyCommentBox} name='replyComment' placeholder='Reply..' variant='outlined' onClick={() => this.changeToRichText(comments.id, true)} />
                              :
                              <Box component='div' mt={4}>
                                <CKEditor
                                  config={{
                                    toolbar: ['heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote']
                                  }}
                                  editor={ClassicEditor}
                                  onInit={() => {
                                    const a: { [key: string]: boolean } = {};
                                    a[comments.id] = true;
                                    this.setState({
                                      disableReply: a
                                    });
                                  }}
                                  onChange={(_event: React.ChangeEvent<HTMLInputElement>, editor: IEditor) => {
                                    const textComment: string = editor.getData();
                                    this.setState({ replyComment: textComment });
                                    const a: { [key: string]: boolean } = {};
                                    if (!textComment) {
                                      a[comments.id] = true;
                                      this.setState({ disableReply: a });
                                    } else {
                                      a[comments.id] = false;
                                      this.setState({ disableReply: a });
                                    }
                                  }}
                                />
                                <Box component='div' className={styles.pullRight} mt={1} mr={1}>
                                  <Button variant='contained' color='primary' onClick={() => this.changeToRichText(comments.id, false)}>Cancel</Button>{'  '}
                                  <Button className='git-lab-reply-comment-btn' disabled={this.state.disableReply[comments.id]}
                                    variant='contained' color='primary' onClick={() => this.onSubmitReplyComment(comments.id)}>Comment</Button>
                                </Box>
                              </Box>}
                          </form>
                        </Grid>
                        <div className='clearfix'></div>
                      </Grid> : null}
                  </Box> : undefined
              })}
            </Box> : undefined
        })
        }
        <Box component='div' mt={3}>
          <CKEditor
            id='submitComment'
            onInit={(editor: IEditor) => {
              this.editorInstance = editor;
            }}
            config={{
              toolbar: ['heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote']
            }}
            editor={ClassicEditor}
            onChange={(_event: React.ChangeEvent<HTMLInputElement>, editor: IEditor) => {
              const textComment: string = editor.getData();
              this.setState({ commentText: textComment });
              if (textComment) {
                this.setState({ disableCommentButton: false });
              } else {
                this.setState({ disableCommentButton: true });
              }
            }}
          />
          <Box component='div' mt={2}>
            <Button className={styles.gitCommentSubmitButton} disabled={this.state.disableCommentButton} onClick={this.onSubmitComment}
              type='button' variant='contained' color='primary' id='git-lab-comment-submit-button'>Comment</Button>
          </Box>
        </Box>
      </Box>
    )
  }

  private getComments = (): void => {
    const apiURL: string = `${this.props.gitLabURL}/api/v4/projects/${this.props.projectID}/issues/${this.props.issueID}/discussions?access_token=${this.props.accessToken}`;
    const responseData: Promise<IComments[] | IUser> = this.fetchData(apiURL);
    responseData.then((comments: IComments[] | IUser) => {
      if (Array.isArray(comments)) {
        if ('notes' in comments[0]) {
          this.setState({ allComments: comments });
        }
      }
    });
  }

  private getUserInfo = (accessToken: string): void => {
    const apiURL: string = `${this.props.gitLabURL}/api/v4/user?access_token=${accessToken}`;
    this.fetchData(apiURL).then((user: IComments[] | IUser) => {
      if ('id' in user) {
        this.setState({ userId: user.id, userAvatar: user.avatar_url, userName: user.name });
      }
    });
  }

  private fetchData = (apiURL: string): Promise<IComments[] | IUser> => {
    return new Promise((resolve) => {
      fetch(apiURL, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }).then((res) => res.json())
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          resolve(error);
        });
    });
  }

  private onSubmitComment = (): void => {
    const commentApiUrl: string = `${this.props.gitLabURL}/api/v4/projects/${this.props.projectID}/issues/${this.props.issueID}/discussions`;
    const commentBody: ICommentBody = {
      id: this.props.projectID,
      issue_iid: this.props.issueID,
      body: this.state.commentText
    };
    const params: IRequestParams = {
      method: 'POST',
      accessToken: this.props.accessToken
    };

    this.postData(commentBody, commentApiUrl, params).then((commentResponse: IComments[]) => {
      if (commentResponse) {
        this.editorInstance.setData('');
        this.getComments();
      }
    });
  }

  private postData = (data: ICommentBody, url: string, params: IRequestParams): Promise<IComments[]> => {
    return new Promise((resolve) => {
      fetch(url, {
        headers: {
          Accept: 'application/x-www-form-urlencoded',
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + params.accessToken,
        },
        method: params.method,
        body: JSON.stringify(data)
      }).then((res) => res.json())
        .then((response) => {
          resolve(response);
        }).catch(() => {
          resolve(undefined);
        });
    });
  }

  private changeToRichText = (commentId: string, value: boolean): void => {
    const a: { [key: string]: boolean } = {};
    a[commentId] = value;
    this.setState({
      richText: a
    });
  }

  private showEditComment = (commentId: string): void => {
    const a: { [key: string]: boolean } = {};
    a[commentId] = true;
    this.setState({
      editComment: a
    });
  }

  private cancelEdit = (id: string): void => {
    const a: { [key: string]: boolean } = {};
    a[id] = false;
    this.setState({ editComment: a });
  }

  private editComment = (discussionId: string, noteId: string) => {
    const editCommentApiUrl = `${this.props.gitLabURL}/api/v4/projects/${this.props.projectID}/issues/${this.props.issueID}/discussions/${discussionId}/notes/${noteId}`;
    const commentBody: ICommentBody = {
      id: this.props.projectID,
      issue_iid: this.props.issueID,
      body: this.state.editedContent,
      discussion_id: discussionId,
      note_id: noteId
    };
    const params: IRequestParams = {
      method: 'PUT',
      accessToken: this.props.accessToken
    };
    this.postData(commentBody, editCommentApiUrl, params).then((commentResponse: IComments[]) => {
      if (commentResponse) {
        this.cancelEdit(discussionId);
        this.getComments();
      }
    });
  }

  private onSubmitReplyComment = (commentId: string): void => {
    const apiURL: string = `${this.props.gitLabURL}/api/v4/projects/${this.props.projectID}/issues/${this.props.issueID}/discussions/${commentId}/notes`;
    const commentBody: ICommentBody = {
      id: this.props.projectID,
      issue_iid: this.props.issueID,
      body: this.state.replyComment,
      discussion_id: commentId
    };
    const params: IRequestParams = {
      method: 'POST',
      accessToken: this.props.accessToken
    };
    this.postData(commentBody, apiURL, params).then((commentResponse: IComments[]) => {
      if (commentResponse) {
        this.changeToRichText(commentId, false);
        this.getComments();
      }
    });
  }
  private moreButtonClick = (event: React.MouseEvent, noteId: string): void => {
    const a: { [key: string]: boolean } = {};
    a[noteId] = true;
    console.log(typeof (event.currentTarget));
    this.setState({ moreOptions: a, anchorEl: event.currentTarget });

  }

  private closeMoreOptions = (noteId: string): void => {
    const a: { [key: string]: boolean } = {};
    a[noteId] = false;
    this.setState({ moreOptions: a, anchorEl: null });
  }

  private confirmDelete = (discussionId: string, noteId: string) => {
    const a: { [key: string]: boolean } = {};
    a[noteId] = false;
    this.setState({
      moreOptions: a,
      openAlert: true,
      discussionId: discussionId,
      noteId: noteId,
      anchorEl: null
    });
  }


}
export default GitLabDiscussions;