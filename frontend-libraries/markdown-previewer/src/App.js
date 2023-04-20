import React, { useState, useEffect } from "react"
import marked from "marked"
import "./App.scss"

function App() {
  const initialText = `# Welcome to my React Markdown Previewer!

## This is a sub-heading...
### And here's some other cool stuff:
  
Heres some code, \`<div></div>\`, between 2 backticks.

---

\`\`\`
// this is multi-line code:

function anotherExample(firstLine, lastLine) {
  if (firstLine == '\`\`\`' && lastLine == '\`\`\`') {
    return multiLineCode;
  }
}
\`\`\`
  
You can also make text **bold**... whoa!
Or _italic_.
Or... wait for it... **_both!_**
And feel free to go crazy ~~crossing stuff out~~.

There's also [links](https://www.freecodecamp.com), and
> Block Quotes!

And if you want to get really crazy, even tables:

Wild Header | Crazy Header | Another Header?
------------ | ------------- | ------------- 
Your content can | be here, and it | can be here....
And here. | Okay. | I think we get it.

- And of course there are lists.
  - Some are bulleted.
     - With different indentation levels.
        - That look like this.


1. And there are numbererd lists too.
1. Use just 1s if you want! 
1. But the list goes on...
- Even if you use dashes or asterisks.
* And last but not least, let's not forget embedded images:

![Tux](https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Tux_Enhanced.svg/800px-Tux_Enhanced.svg.png)
`

  const [markdown, setMarkdown] = useState(initialText)

  useEffect(() => {
    document.getElementById("preview").innerHTML = marked(markdown, {
      breaks: true,
    })
  }, [markdown])

  return (
    <div className="App">
      <div className="main">
        <h1 id="header">Markdown Previewer</h1>
        <span className="links">
          <a href="https://github.com/vimturtle/">Source</a>
        </span>
        <div id="main">
          <textarea
            id="editor"
            onChange={() =>
              setMarkdown(document.getElementById("editor").value)
            }
            spellcheck="false"
          >
            {markdown}
          </textarea>
          <div className="split" id="preview">
            <h2>Preview</h2>
            {marked(markdown, { breaks: true })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
