module.exports = {
  id: 'newSMS',
  name: 'New SMS',
  type: 'RC',
  eventFilter: '/restapi/v1.0/account/~/extension/~/message-store/instant?type=SMS',
  outputData: [
    {
      id: 'trigger.newSMS.sender.number',
      name: 'New SMS: Sender Number',
      type: 'string',
      testData: '+12345678900',
    },
    {
      id: 'trigger.newSMS.subject',
      name: 'New SMS: Message text',
      type: 'string',
      testData: 'Hello, this is new message',
    },
    {
      id: 'trigger.newSMS.creationTime',
      name: 'New SMS: Creation Time',
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
      'trigger.newSMS.sender.number': event.body.from.phoneNumber,
      'trigger.newSMS.subject': event.body.subject,
      'trigger.newSMS.creationTime': event.body.creationTime,
    }
  },
};
