import React, { useState, useEffect, useRef } from "react";
import "./App.scss";
import data from "./data.json";

type Chip = {
  name: string;
  email: string;
};

export const ChipComponent: React.FC = () => {
  const [items, setItems] = useState<Chip[]>(data); //data imported from another file
  const [chips, setChips] = useState<Chip[]>([]);
  const [inputValue, setInputValue] = useState("");

  const [top, setTop] = useState(0);
  const [left, setLeft] = useState(0); //these variables are to adjust the positioning of suggested name list

  const inputRef = useRef<HTMLInputElement>(null); // Created a ref for the input

  useEffect(() => {
    if (inputRef.current) {
      const rect = inputRef.current.getBoundingClientRect();
      const computedStyle = window.getComputedStyle(inputRef.current);
      const marginBottom = parseFloat(computedStyle.marginBottom);

      setTop(rect.bottom + marginBottom + window.scrollY);
      setLeft(rect.left + window.scrollX);
    }
  }, [chips]);

  const handleAddChip = (chipToAdd: Chip) => {
    setChips([...chips, chipToAdd]);
    setItems(items.filter((chip) => chip.email !== chipToAdd.email));
    setInputValue("");
  }; //Add chips while deleteing to Chips list

  const handleRemoveChip = (chipToRemove: Chip) => {
    setChips(chips.filter((chip) => chip.email !== chipToRemove.email));
    setItems([...items, chipToRemove]);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && inputValue === "" && chips.length > 0) {
      const lastChip = chips[chips.length - 1];
      if (lastChip !== undefined) {
        handleRemoveChip(lastChip);
      }
    }
  };

  const filteredItems = items.filter(
    (item) =>
      item.name.toLowerCase().includes(inputValue.toLowerCase()) ||
      item.email.toLowerCase().includes(inputValue.toLowerCase())
  );

  return (
    <div className="container">
      <div className="search-container">
        <div className="chips-container">
          {chips.map((chip, index) => (
            <div key={index} className="chip">
              <div className="icon">
                {chip.name
                  .split(" ")
                  .map((part) => part[0])
                  .join("")
                  .toUpperCase()}
              </div>
              {chip.name}
              <button onClick={() => handleRemoveChip(chip)}>X</button>
            </div>
          ))}
          <input
            type="text"
            value={inputValue}
            ref={inputRef}
            onChange={handleInputChange}
            onKeyDown={handleInputKeyDown}
            placeholder="Add new user..."
          />
        </div>
        {inputValue && (
          <ul
            className={`suggestions-list ${
              filteredItems.length === 0 ? "empty" : ""
            }`}
            style={{
              top: `${top}px`,
              left: `${left}px`,
            }}
          >
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <li
                  className="list-item"
                  key={item.email}
                  onClick={() => handleAddChip(item)}
                >
                  <div className="icon">
                    {item.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </div>
                  <span className="name">{item.name}</span>
                  <span className="email">{item.email}</span>
                </li>
              ))
            ) : (
              <li className="no-match">No matches found</li>
            )}
          </ul>
        )}
      </div>

      {/* below div element explains the working and functionality*/}
      <div>
        <p>
          Displays an input field that reveals a list of selectable items, which
          are dynamically filtered based on user input.
        </p>
        <p>
          The list updates in real-time to only show items matching the NAME or
          EMAIL of user, facilitating an efficient search experience.
        </p>
        <p>
          Selecting an item from the list converts it into a chip above the
          input field, with the field adjusting in width to accommodate the new
          chip
        </p>
        <p>
          Each chip features an "X" icon that, when clicked, removes the chip
          and reintroduces the item into the suggestion list.
        </p>
        <p>
          Implements a special interaction where pressing backspace on an empty
          input field highlights the last chip for potential deletion, and a
          subsequent press removes it.
        </p>
        <h3>
          <a
            href="https://www.linkedin.com/in/utkarsh-sonkar-930358153/"
            target="_blank"
          >
            Utkarsh Sonkar
          </a>
        </h3>
        <h3>
          <a
            href="https://portfolio-utkarsh-sonkar.netlify.app/"
            target="_blank"
          >
            portfolio-utkarsh-sonkar.netlify.app/
          </a>
        </h3>
      </div>
    </div>
  );
};
