module.exports = {
  types: [
    {
      value: '✨',
      name: ' - New Feature'
    },
    {
      value: '🐛',
      name: ' - Bug Fix'
    },
    {
      value: '🔨',
      name: ' - Refactor'
    },
    {
      value: '🎉',
      name: ' - Initialize'
    },
    {
      value: '💄',
      name: ' - User Interface'
    },
    {
      value: '✏️️️',
      name: ' - Code Style'
    },
    {
      value: '📝',
      name: ' - Documentation'
    },
    {
      value: '🔥',
      name: ' - Remove Garbage'
    },
    {
      value: '⏪',
      name: ' - Revert'
    },
    {
      value: '🔀',
      name: ' - Branch Merge'
    },
    {
      value: '✅',
      name: ' - Test Code'
    },
    {
      value: '🔧',
      name: ' - Configuration Changes'
    },
    {
      value: '📦',
      name: ' - Destination Files'
    }
  ],

  skipQuestions: ['scope', 'body'],
  
  allowCustomScopes: false,
  allowBreakingChanges: ['feat', 'fix'],

  subjectLimit: 64
}
