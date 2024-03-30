const { mdProcessor } = require('./index')

test('Checks bold parsing', () => {
  mdProcessor('./test-data/bold-test.txt').then((data) => {
    expect(data.join('')).toBe('<p>This is a <b>bold</b></p>')
  })
})

test('Checks italic parsing', () => {
  mdProcessor('./test-data/italic-test.txt').then((data) => {
    expect(data.join('')).toBe('<p>Here\'s an <i>italic</i> text example</p>')
  })
})

test('Checks bold parsing', () => {
  mdProcessor('./test-data/monospace-test.txt').then((data) => {
    expect(data.join('')).toBe('<p>You can use monospaced text for code snippets like <tt>print("Hello, world!")</tt></p>')
  })
})
