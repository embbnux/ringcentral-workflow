module.exports = {
  id: 'newTeamMessaging',
  name: 'New team messaging',
  type: 'RC',
  eventFilter: '/restapi/v1.0/glip/posts',
  outputData: [
    {
      id: 'groupId',
      name: 'Conversation ID',
      type: 'string',
      testData: '995723345922',
    },
    {
      id: 'text',
      name: 'Message text',
      type: 'string',
      testData: 'Hello, World :)',
    },
    {
      id: 'mentionMe',
      name: 'Mention me',
      type: 'boolean',
      testData: true,
    },
    {
      id: 'creationTime',
      name: 'Creation Time',
      type: 'date',
      testData: '2020-01-01T00:00:00.000Z',
    },
  ],
  canHandle: ({ user, event }) => {
    return (
      event.event === '/restapi/v1.0/glip/posts' &&
      event.body.eventType === 'PostAdded' &&
      event.body.creatorId !== user.id
    );
  },
  dataHandler: ({ event }) => {
    return {
      groupId: event.body.groupId,
      text: event.body.text,
      mentionMe: !!(event.body.mentions && event.body.mentions.indexOf(event.ownerId) > 0),
      creationTime: event.body.creationTime,
    }
  },
};
