import textareaCaret from 'textarea-caret';
import TextField from '@mui/material/TextField';
import Popover from '@mui/material/Popover';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useRef, useState } from 'react';

import './App.css'

function getCaretCoordinates(inputRef: HTMLInputElement | null) {
  return inputRef
    ? textareaCaret(inputRef, inputRef?.selectionEnd)
    : { top: 0, left: 0, height: 0 };
}


function getActiveToken(input, cursorPosition) {
  const tokenizedQuery = input.split(/[\s\n]/).reduce((acc, word, index) => {
    const previous = acc[index - 1];
    const start = index === 0 ? index : previous.range[1] + 1;
    const end = start + word.length;

    return acc.concat([{ word, range: [start, end] }]);
  }, []);

  if (cursorPosition === undefined) {
    return undefined;
  }

  const activeToken = tokenizedQuery.find(
    ({ range }) => range[0] < cursorPosition && range[1] >= cursorPosition
  );

  return activeToken;
}


function App() {

  const [text, setText] = useState("")
  const [coords, setCoords] = useState({ x: 0, y: 0 })

  const [open, setOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null);

  const cursorPosition = inputRef.current?.selectionEnd || 0;
  const activeToken = getActiveToken(text, cursorPosition);

  const rect = inputRef.current?.getBoundingClientRect() || {};
  const x = rect.left;
  const t = rect.top;
  const { top, left } = getCaretCoordinates(inputRef.current);
  const dx = t + top
  const dy = x + left
  console.log("activeToken", activeToken)
  console.log(activeToken?.word === "#")

  function handleClick() {
    setOpen(!open)
  }

  function handleChange(e: any) {
    setText(e.target.value)

  }

  function handleClose(menuValue: string) {
    setText(text + menuValue)
    setOpen(false)

  }

  return (
    <>
      <div className="card">
        <TextField
          fullWidth
          inputRef={inputRef}
          value={text}
          id="filled-basic"
          label="Filled"
          variant="filled"
          onChange={(e) => handleChange(e)}
        />
        <Menu
          sx={{ mt: 3 }}
          id="demo-positioned-menu"
          aria-labelledby="demo-positioned-button"
          open={activeToken?.word === "#"}
          onClose={handleClick}
          anchorReference="anchorPosition"
          autoFocus={false}
          disableAutoFocus={true}
          disableEnforceFocus={true}
          anchorPosition={{
            top: dx,
            left: dy
          }}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
        >
          <MenuItem onClick={() => handleClose('JavaScript')}>#JavaScript</MenuItem>
          <MenuItem onClick={() => handleClose('Clojure')}>#Clojure</MenuItem>
          <MenuItem onClick={() => handleClose('Python')}>#Python</MenuItem>
        </Menu>
      </div>
    </>
  )
}

export default App
