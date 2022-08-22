module.exports = {
  id: 'newSMS',
  name: 'New SMS',
  type: 'RC',
  eventFilter: '/restapi/v1.0/account/~/extension/~/message-store/instant?type=SMS',
  outputData: [
    {
      id: 'from',
      name: 'From Number',
      type: 'string',
      testData: '+1234567890',
    },
    {
      id: 'subject',
      name: 'Message text',
      type: 'string',
      testData: 'Hello, this is new message',
    },
    {
      id: 'creationTime',
      name: 'Creation Time',
      type: 'date',
      testData: '2020-01-01T00:00:00.000Z',
    },
  ],
  canHandle: ({ user, event }) => {
    const normalizedEventFilter = event.event.replace(user.accountId, '~').replace(user.id, '~');
    return (
      normalizedEventFilter === '/restapi/v1.0/account/~/extension/~/message-store/instant?type=SMS'
    );
  },
  dataHandler: ({ event }) => {
    return {
      from: event.body.from.phoneNumber,
      subject: event.body.subject,
      creationTime: event.body.creationTime,
    }
  },
};
