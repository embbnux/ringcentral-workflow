module.exports = {
  id: 'newTeamMessaging',
  name: 'New team messaging',
  type: 'RC',
  eventFilter: '/restapi/v1.0/glip/posts',
  outputData: [
    {
      id: 'trigger.newTeamMessaging.conversationId',
      name: 'New Message: Conversation ID',
      type: 'string',
      testData: '995723345922',
    },
    {
      id: 'trigger.newTeamMessaging.text',
      name: 'New Message: Message text',
      type: 'string',
      testData: 'Hello, World :)',
    },
    {
      id: 'trigger.newTeamMessaging.mentionMe',
      name: 'New Message: Mention me',
      type: 'boolean',
      testData: true,
    },
    {
      id: 'trigger.newTeamMessaging.creationTime',
      name: 'New Message: Creation Time',
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
      'trigger.newTeamMessaging.conversationId': event.body.groupId,
      'trigger.newTeamMessaging.text': event.body.text,
      'trigger.newTeamMessaging.mentionMe': !!(event.body.mentions && event.body.mentions.find(m => m.id === event.ownerId)),
      'trigger.newTeamMessaging.creationTime': event.body.creationTime,
    }
  },
};
